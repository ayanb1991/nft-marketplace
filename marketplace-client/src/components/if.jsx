import PropTypes from 'prop-types';

const If = ({ condition, children }) => {
  return condition ? children : null;
};

If.propTypes = {
  condition: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default If;