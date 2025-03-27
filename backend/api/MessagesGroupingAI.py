import numpy as np
import hdbscan
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_distances

def MessageGroupAI(sentences):
    """
    Groups similar messages using semantic embeddings and HDBSCAN clustering.
    
    @param sentences: List of text messages to cluster
    @return: Tuple (clusters, probabilities)
    @raises ValueError: If fewer than 2 sentences provided
    """
    if len(sentences) < 2:
        raise ValueError(f"Need at least 2 sentences, got {len(sentences)}")

    # Generate embeddings using a sentence transformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(sentences)
    
    # Convert to precomputed distances for HDBSCAN
    distance_matrix = cosine_distances(embeddings).astype(np.float64)

    # Configure clustering with optimal parameters for short text
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=2,
        min_samples=1,
        metric='precomputed',
        cluster_selection_method='eom',
        cluster_selection_epsilon=0.001
    )

    clusters = clusterer.fit_predict(distance_matrix)
    probabilities = clusterer.probabilities_

    return clusters, probabilities