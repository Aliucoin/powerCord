const { React, i18n: { Messages } } = require('powerCord/webpack');
const { Card, Tooltip, Switch } = require('powerCord/components');

const BaseProduct = require('./BaseProduct');

class InstalledProduct extends BaseProduct {
  render () {
    return (
      <Card className='powerCord-product'>
        {this.renderHeader()}
        {this.renderDetails()}
        {this.renderPermissions()}
        {this.renderFooter()}
      </Card>
    );
  }

  renderHeader () {
    return (
      <div className='powerCord-product-header'>
        <h4>{this.props.product.name}</h4>
        <Tooltip text={this.props.isEnabled ? Messages.DISABLE : Messages.ENABLE} position='top'>
          <div>
            <Switch value={this.props.isEnabled} onChange={v => this.props.onToggle(v.target.checked)}/>
          </div>
        </Tooltip>
      </div>
    );
  }
}

module.exports = InstalledProduct;
