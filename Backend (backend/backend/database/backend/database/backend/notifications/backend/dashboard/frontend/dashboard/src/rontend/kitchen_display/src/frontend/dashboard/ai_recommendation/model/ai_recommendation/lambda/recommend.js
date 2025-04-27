const tf = require('@tensorflow/tfjs');

exports.handler = async (event) => {
  const { user_id } = event;
  const model = await tf.loadLayersModel('s3://bistro92-models/recommendation_model');
  
  // Dummy prediction logic
  const user_idx = 0; // Map user_id to index
  const item_indices = Array.from({ length: 10 }, (_, i) => i); // Assume 10 items
  const predictions = model.predict([tf.tensor([user_idx]), tf.tensor(item_indices)]);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ recommendations: predictions.arraySync() })
  };
};
