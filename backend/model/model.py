import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

from utils import generate_embedding


class Model:
    def __init__(self, name: str, n_neighbors: int = 5):
        """
        Initialize KNN model with cosine similarity.
        :param name: model name for saving/loading
        :param n_neighbors: number of neighbors to consider in KNN
        """
        self.model = KNeighborsClassifier(n_neighbors=n_neighbors, metric='cosine')
        self.name = name
        self.data = []
        self.labels = []

    def save(self) -> None:
        """
        Save the trained KNN model and associated label names (tags) to a file
        """
        joblib.dump(self.model, self.name + '.pkl')

    def load(self, name) -> None:
        """
        Load the KNN model and associated label names (tags) from a file
        """
        self.model = joblib.load(name + '.pkl')

    def train(self, data, labels) -> None:
        """
        Train the KNN model using embeddings and their associated tags (labels)
        :param data: List of embeddings (features)
        :param labels: List of corresponding labels (tags)
        """
        self.data = data
        self.labels = labels
        self.model.fit(data, labels)

    def add_transaction(self, transaction: dict) -> None:
        """
        Add a new transaction, generate its embedding, and train the model incrementally
        :param transaction: Dictionary containing the transaction data
        """
        embedding = generate_embedding(transaction)
        tag = self.predict(transaction)

        self.data.append(embedding)
        self.labels.append(tag)
        self.model.fit(self.data, self.labels)

    def predict(self, transaction: dict) -> str:
        """
        Predict the tag (label) for a given transaction using KNN with cosine similarity
        :param transaction: Dictionary containing the transaction data
        :return: The predicted tag (label) for the given transaction
        """
        embedding = generate_embedding(transaction).reshape(1, -1)
        predicted_label = self.model.predict(embedding)
        return predicted_label[0]

    def predict2(self, emb):
        predicted_label = self.model.predict([emb])
        return predicted_label[0]


if __name__ == "__main__":
    model = Model("knn_model", n_neighbors=17)
    data = np.load("backend/database/embeddings.npy")
    labels = np.load("backend/database/labels.npy")
    model.train(data[:80], labels[:80])

    total = 0
    for x, y in zip(data[80:], labels[80:]):
        res = model.predict2(x)
        if res == y:
            total += 1
    print(total)
