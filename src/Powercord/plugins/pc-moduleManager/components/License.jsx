const { React, getModuleByDisplayName, i18n: { Messages } } = require('powerCord/webpack');
const { Card, AsyncComponent } = require('powerCord/components');
const { Modal } = require('powerCord/components/modal');

const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));

module.exports = ({ spdx, license: { name, url, permissions, conditions, limitations } }) => {
  const data = {
    permissions,
    conditions,
    limitations
  };

  return (
    <Modal className='powerCord-product-license-modal'>
      <Modal.Header>
        <FormTitle tag='h4'>{name}</FormTitle>
      </Modal.Header>
      <Modal.Content>
        <p className='powerCord-product-license-modal-desc'>{Messages[`POWERCORD_PLUGINS_LICENSE_DESC_${spdx}`]}</p>
        <Card className='powerCord-product-license-modal-card'>
          {Messages.POWERCORD_PLUGINS_LICENSE_DISCLAIMER.format({ url })}
        </Card>
        {[ 'permissions', 'limitations', 'conditions' ].map(type =>
          <div key={type} className={`powerCord-product-license-modal-data ${type}`}>
            <FormTitle tag='h4'>{Messages[`POWERCORD_PLUGINS_LICENSE_${type.toUpperCase()}`]}</FormTitle>
            {data[type].map(perm => <div key={perm} className='powerCord-product-license-modal-entry'>
              <span>{Messages[`POWERCORD_PLUGINS_LICENSE_${perm}_NAME`]}</span>
              <div>{perm === 'PATENT_USE'
                ? type === 'permissions'
                  ? Messages.POWERCORD_PLUGINS_LICENSE_PATENT_USE_DESC_ALLOWED
                  : Messages.POWERCORD_PLUGINS_LICENSE_PATENT_USE_DESC_FORBIDDEN
                : Messages[`POWERCORD_PLUGINS_LICENSE_${perm}_DESC`]}</div>
            </div>)}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
};
