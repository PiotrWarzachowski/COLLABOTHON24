import joblib
from sklearn.neighbors import KNeighborsClassifier
from generate_embeddings import generate_embedding


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

    def save(self):
        """
        Save the trained KNN model and associated label names (tags) to a file
        """
        joblib.dump(self.model, self.name + '.pkl')

    def load(self, name):
        """
        Load the KNN model and associated label names (tags) from a file
        """
        self.model = joblib.load(name + '.pkl')

    def train(self, data, labels):
        """
        Train the KNN model using embeddings and their associated tags (labels)
        :param data: List of embeddings (features)
        :param labels: List of corresponding labels (tags)
        """
        self.data = data
        self.labels = labels
        self.model.fit(data, labels)

    def add_transaction(self, transaction: dict, tag: str):
        """
        Add a new transaction, generate its embedding, and train the model incrementally
        :param transaction: Dictionary containing the transaction data
        :param tag: The label (tag) associated with the transaction
        """
        embedding = generate_embedding(transaction)
        self.data.append(embedding)
        self.labels.append(tag)
        self.model.fit(self.data, self.labels)

    def predict(self, transaction: dict):
        """
        Predict the tag (label) for a given transaction using KNN with cosine similarity
        :param transaction: Dictionary containing the transaction data
        :return: The predicted tag (label) for the given transaction
        """
        embedding = generate_embedding(transaction).reshape(1, -1)
        predicted_label = self.model.predict(embedding)
        return predicted_label[0]
