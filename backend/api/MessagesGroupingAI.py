import numpy as np
import hdbscan
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_distances


def MessageGroupAI(sentences):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    embeddings = model.encode(sentences)


    distance_matrix = cosine_distances(embeddings).astype(np.float64)


    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=2,
        min_samples=1, 
        metric='precomputed',
        cluster_selection_method='eom',
        cluster_selection_epsilon=0.1  
    )
    clusters = clusterer.fit_predict(distance_matrix)

    clusters = clusterer.fit_predict(distance_matrix)


    for i, sentence in enumerate(sentences):
        print(f"Sentence: '{sentence}' => Cluster: {clusters[i]}")
