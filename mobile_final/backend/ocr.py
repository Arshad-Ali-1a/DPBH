from PIL import Image
import pyocr
import pyocr.builders
import cv2

tools = pyocr.get_available_tools()
# print(tools)
tool = tools[0]
langs = tool.get_available_languages()
lang = "eng"


def extract_text(image_path):
    all_txt = tool.image_to_string(
        Image.open(image_path),
        lang=lang,
        builder=pyocr.builders.TextBuilder(),
    )
    word_with_locations = tool.image_to_string(
        Image.open(image_path),
        lang="eng",
        builder=pyocr.builders.WordBoxBuilder(),
    )
    sentences_with_locations = tool.image_to_string(
        Image.open(image_path),
        lang="eng",
        builder=pyocr.builders.LineBoxBuilder(),
    )
    return (all_txt, word_with_locations, sentences_with_locations)


def highlight_region(image_path, regions, colour=(255, 0, 0),padding=5):
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
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
    print(img_rgb.shape)
    Image.fromarray(img_rgb).save("output.png")


if __name__ == "__main__":
    IMG_PATH=r"C:\Users\Mohammad Arshad Ali\Pictures\Screenshots\Screenshot 2024-01-22 131838.png"
    all_txt, word_with_locations, sentences_with_locations=extract_text(IMG_PATH)
    print(all_txt,sep="\n")
    # print(dir(sentences_with_locations[1]))
    # for i in (sentences_with_locations[1].position,):
    #     (x, y), (x2, y2) = i
    #     print(x,y,x2,y2)

    highlight_region(IMG_PATH, sentences_with_locations)
