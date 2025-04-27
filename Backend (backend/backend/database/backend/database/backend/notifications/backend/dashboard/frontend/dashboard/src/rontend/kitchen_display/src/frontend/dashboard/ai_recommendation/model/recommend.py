import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split

# Sample data
data = pd.DataFrame({
    'user_id': ['u1', 'u1', 'u2', 'u2'],
    'item_id': ['i1', 'i2', 'i1', 'i3'],
    'rating': [5, 3, 4, 5]
})

# Collaborative filtering model
user_ids = data['user_id'].unique()
item_ids = data['item_id'].unique()
user2idx = {u: i for i, u in enumerate(user_ids)}
item2idx = {i: j for j, i in enumerate(item_ids)}

data['user_idx'] = data['user_id'].map(user2idx)
data['item_idx'] = data['item_id'].map(item2idx)

X = data[['user_idx', 'item_idx']].values
y = data['rating'].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

n_users = len(user_ids)
n_items = len(item_ids)
embedding_dim = 50

user_input = tf.keras.layers.Input(shape=(1,))
item_input = tf.keras.layers.Input(shape=(1,))
user_embedding = tf.keras.layers.Embedding(n_users, embedding_dim)(user_input)
item_embedding = tf.keras.layers.Embedding(n_items, embedding_dim)(item_input)
user_vec = tf.keras.layers.Flatten()(user_embedding)
item_vec = tf.keras.layers.Flatten()(item_embedding)
dot_product = tf.keras.layers.Dot(axes=1)([user_vec, item_vec])

model = tf.keras.Model(inputs=[user_input, item_input], outputs=dot_product)
model.compile(optimizer='adam', loss='mse')

model.fit([X_train[:, 0], X_train[:, 1]], y_train, epochs=10, batch_size=32)
model.save('recommendation_model')
