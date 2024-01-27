#### Dataset 

The foundation of the dark pattern texts within the [dataset](https://github.com/yamanalab/ec-darkpattern/blob/master/dataset/dataset.tsv )  traces back to Mathur et al.’s study in 2019. This compilation encompasses 1,818 instances extracted from diverse shopping sites. To ensure a well-rounded and comprehensive dataset, non-dark pattern texts are thoughtfully included. These non-dark pattern texts are sourced from e-commerce sites, strategically accessed and segmented based on insights gleaned from Mathur et al.'s study.

#### TFIDF Preprocessing

This rich collection of textual information undergoes a transformative process through TFIDF (Term Frequency-Inverse Document Frequency) preprocessing. TFIDF is a powerful technique that transforms text data into numerical vectors, capturing the significance of words within the dataset. The process involves calculating the frequency of words in context to the sentence. During this process, English stop words are excluded, and the number of features is limited to 5000. This ensures that the TFIDF transformation yields concise yet informative representations of the original textual data.

#### Model Accuracy Comparison

Below is a comparison of accuracy scores for different models, including logistic regression, random forest, support vector machine, naive Bayes, and XGBoost that we have tried during the R&D stage of product development. Out of this the best model is the XGB Classifier which we have used in this product

| Model                    | Accuracy |
|--------------------------|----------|
| Logistic Regression      | 0.9008   |
| Random Forest            | 0.9235   |
| Support Vector Machine   | 0.9008   |
| Naive Bayes              | 0.9037   |
| XGBoost                  | 0.9405   |


#### XGBoost Model Configuration

The XGBoost (XGB) classifier is configured with a learning rate of 0.01, parallel processing (n_jobs) set to 4, and 1000 estimators. This strategic configuration ensures the model is adept at learning patterns within the dataset and contributes to its high accuracy in the context of dark pattern detection.
