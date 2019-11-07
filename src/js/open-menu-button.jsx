import { KeyCodes, parseKeyCode } from 'utils/key-codes';
import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line react/prop-types
const OpenMenuButton = (props) => {
  let labelContent;

  switch (typeof props.label) {
    case 'string': {
      labelContent = <span>{props.label}</span>;
      break;
    }

    case 'function': {
      labelContent = props.label();
      break;
    }

    // eslint skip default
  }

  return (
    <div
      data-testid="open-menu-button"
      role="button"
      className="open-menu-btn"
      tabIndex={0}
      onClick={props.onClick}
      onKeyPress={(e) => { if (parseKeyCode(e) === KeyCodes.ENTER) { props.onClick(e); } }}>
      {labelContent}
    </div>
  );
};

OpenMenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ])
};

OpenMenuButton.defaultProps = {
  label: 'Open'
};

export default OpenMenuButton;
