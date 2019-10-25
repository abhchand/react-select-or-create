import { keyCodes, parseKeyCode } from 'utils';
import PropTypes from 'prop-types';
import React from 'react';

const CloseMenuButton = (props) => {
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
      data-testid="close-menu-button"
      role="button"
      className="close-menu-btn"
      tabIndex={0}
      onClick={props.onClick}
      onKeyPress={(e) => { if (parseKeyCode(e) === keyCodes.ENTER) { props.onClick(e); } }}>
      {labelContent}
    </div>
  );
};

CloseMenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ])
};

CloseMenuButton.defaultProps = {
  label: 'Close'
};

export default CloseMenuButton;
