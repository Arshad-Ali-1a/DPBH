from fastapi import FastAPI,Response
from PIL import Image
import pyocr
import pyocr.builders
import uvicorn
import numpy as np
import cv2
import requests

app = FastAPI()
DARK_PATTERNS_URL="https://api-dark-pattern.onrender.com/classify_texts"

tools = pyocr.get_available_tools()
tool = tools[0]
# langs = tool.get_available_languages()
lang = "eng"

def extract_text(image_arr):
    image_arr = np.array(image_arr, dtype=np.uint8)
    all_txt = tool.image_to_string(
        Image.fromarray(image_arr),
        lang=lang,
        builder=pyocr.builders.TextBuilder(),
    )
    word_with_locations = tool.image_to_string(
        Image.fromarray(image_arr),
        lang="eng",
        builder=pyocr.builders.WordBoxBuilder(),
    )
    sentences_with_locations = tool.image_to_string(
        Image.fromarray(image_arr),
        lang="eng",
        builder=pyocr.builders.LineBoxBuilder(),
    )
    return (all_txt, word_with_locations, sentences_with_locations)


def highlight_region(img_arr, regions, colour=(255, 0, 0),padding=5)->np.ndarray:
    img_arr= np.array(img_arr, dtype=np.uint8)
    img_rgb=img_arr
    # img_rgb = cv2.cvtColor(img_arr, cv2.COLOR_BGR2RGB)
    for i in regions:
        (x, y), (x2, y2) = i.position
        x -= padding
        y -= padding
        x2 += padding
        y2 += padding
        try:
            cv2.rectangle(img_rgb, (x, y), (x2, y2), colour, 2)
        except:
            pass
    # Image.fromarray(img_rgb).save("output_darkness.png")
    Image.fromarray(img_rgb).show()

    return img_rgb


@app.get("/")
def read_root():
    return {"Hello": "World"}



@app.post("/extract_text")
async def json_input(data: dict):
    image_arr = data["img_data"]
    all_txt, word_with_locations, sentences_with_locations = extract_text(image_arr)
    return {"all_txt": all_txt, "word_with_locations": word_with_locations, "sentences_with_locations": sentences_with_locations}


@app.post("/detect_darkness")
async def json_input(data: dict,response:Response):
    image_arr = data["img_data"]
    all_txt, word_with_locations, sentences_with_locations = extract_text(image_arr)
    # return {"all_txt": all_txt, "word_with_locations": word_with_locations, "sentences_with_locations": sentences_with_locations}
    all_txt=[line.content for line in sentences_with_locations]
    
    # all_txt=all_txt.split("\n\n")
    all_txt=[{"text":i} for i in all_txt]
    print("all_txt: \n\n",all_txt,flush=True)

    res=requests.post(DARK_PATTERNS_URL,json={"data": all_txt})
    print("sentences_with_locations",len(sentences_with_locations),flush=True)

    print("\n\nfrom darkness server:",flush=True)

    if not res.ok:
        print(res.status_code,res.reason,flush=True)
        response.status_code=503
        return f"dark pattern server failed : {res.reason}"

    res_dark=res.json()
    res_dark_data=res_dark["result"]
    print(res.json(),flush=True)

    dark_sentences=set()
    dark_sentences_with_locations=[]
    for pattern in res_dark_data:
        for sentence in res_dark_data[pattern]:
            dark_sentences.add(sentence.strip())


    print("dark sentences: ",dark_sentences,flush=True)

            
    for line in sentences_with_locations:
        # print(repr(line.content.strip()))
        if line.content.strip() in dark_sentences:
            dark_sentences_with_locations.append(line)


    #now highlight
    # highlighted_img_data=np.array(image_arr, dtype=np.uint8)
    # print(dark_sentences_with_locations)

    highlighted_img_data=highlight_region(image_arr,dark_sentences_with_locations)

    return {"highlighted_img_data":highlighted_img_data.tolist(), "dark_patterns":res_dark}





if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)
