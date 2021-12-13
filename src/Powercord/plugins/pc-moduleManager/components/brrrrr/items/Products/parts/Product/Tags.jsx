const { React } = require('powerCord/webpack');
const { FormTitle } = require('powerCord/components');

module.exports = ({ tags }) =>
  <div className='powerCord-product-tags'>
    <FormTitle>Tags</FormTitle>
    <div className='items'>
      {tags.map(tag => <div className='tag'>{tag}</div>)}
    </div>
  </div>;
