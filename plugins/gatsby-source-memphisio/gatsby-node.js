const fetch = require('node-fetch');
const queryString = require('query-string');
const md5 = require('md5');

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest
}, configOptions) => {
  const {
    createNode
  } = actions;
  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins;
  // Plugin code goes here...
  // Helper function that processes a seallake Collection envs to match Gatsby's node structure
  const processseallakeenvs = seallakeEnvelops => {
    const nodeId = createNodeId(`seallake-env-${seallakeEnvelops.envelope.envelopeId}`);
    const nodeContent = JSON.stringify(seallakeEnvelops);
    const nodeData = Object.assign({}, seallakeEnvelops, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'sealLakeEnvs',
        content: nodeContent,
        contentDigest: createContentDigest(seallakeEnvelops)
      }
    });
    return nodeData;
  };

  const options1 = {
    method: 'GET',
    headers: {}
  };
  const apiUrl1 = `http://ec2-100-20-87-209.us-west-2.compute.amazonaws.com/API/v1/directory/kmac3`;
  const response = await fetch(apiUrl1, options1);
  const data1 = await response.json();
  // For each env get envelopes properties and envs
  console.log(data1);
  
  data1.directory.content.envelopes.forEach(envelopeObj => {
      const env = envelopeObj;
      console.log(env);
      if (envelopeObj.envelope) {console.log(true)}; 
      const nodeDataEnv = processseallakeenvs(env);
      // Use Gatsby's createNode helper to create a node from the node data
      createNode(nodeDataEnv);
      console.log('you created an env node');
  });
}