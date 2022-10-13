import { useEffect, useRef } from 'react';

/**
 * Checks An Object For Changes
 * @param {object} objectToCompare The Object To Compare
 * @returns {string[]} An Array With All The Changed Keys. Empty If None Changed.
 */
const useObjectCompare = (objectToCompare) => {

	const previousObject = usePrevious(objectToCompare);

	const changedKeys =
		Object
			.keys(objectToCompare)
			.filter(
				key =>
					objectToCompare[key] !== previousObject?.[key]
			);

	return changedKeys;

};

/**
 * Helper hook for useObjectCompare. Sends Back The Previous Value. Also Stores Current Value For Future Use.
 * @param {any} valueToCheck
 * @returns {any} Previous Value
 */
const usePrevious = (valueToCheck) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = valueToCheck;
	});
	return ref.current;
};

export default useObjectCompare;