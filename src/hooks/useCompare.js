import { useEffect, useRef } from 'react';

/**
 * Checks The Given Value And returns if it has changed since last re-render or not.
 * @param {*} valueToCheck - the value to check
 * @returns {boolean} has the value changed?
*/
const useCompare = (valueToCheck) => {
	const prevValue = usePrevious(valueToCheck)
	return prevValue !== valueToCheck
}

// Helper hook for useCompare
const usePrevious = (valueToCheck) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = valueToCheck;
	});
	return ref.current;
}

export default useCompare;