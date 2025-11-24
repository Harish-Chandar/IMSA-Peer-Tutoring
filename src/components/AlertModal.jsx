import React, { useState, useEffect } from "react";

/*
Here is how to implement this modal:

Put this code in the function for each page:
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertTitle, setAlertTitle] = useState('');

Put this code in your HTML:
<AlertModal
	isOpen={showAlert}
	message={alertMessage}
	onConfirm={(result) => {
		// true for OK, false for Cancel
		setShowAlert(false);
	}}
	title={alertTitle}
/>

All you need to do to call the alert is this:
	setAlertTitle("Your Alert Title");
	setAlertMessage("A Custom Message");
	setShowAlert(true);
*/

export function AlertModal({
	isOpen,
	message,
	onConfirm,
	title = "Warning",
	inputValue,
	onInputChange,
	inputLabel,
}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(isOpen);
	}, [isOpen]);

	// Prevent background scroll when modal is open (mobile-friendly)
	useEffect(() => {
		if (isVisible) {
			const original = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = original || "";
			};
		}
	}, [isVisible]);

	const handleConfirm = () => {
		setIsVisible(false);
		if (onConfirm) {
			onConfirm(true);
		}
	};

	const handleCancel = () => {
		setIsVisible(false);
		if (onConfirm) {
			onConfirm(false);
		}
	};

	if (!isVisible) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overscroll-contain z-50">
			<div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-50">
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-gray-900">
						{title}
					</h3>
				</div>
				<div className="mb-6">
					<p className="text-gray-700">{message}</p>
					{typeof inputValue !== "undefined" && onInputChange && (
						<div className="mt-4">
							{inputLabel && (
								<label className="block text-gray-700 mb-1">
									{inputLabel}
								</label>
							)}
							<input
								type="number"
								step="0.01"
								min="0"
								value={inputValue}
								onChange={(e) => onInputChange(e.target.value)}
								className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
							/>
						</div>
					)}
				</div>
				<div className="flex justify-end space-x-3">
					<button
						onClick={handleCancel}
						className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors duration-200"
					>
						Cancel
					</button>
					<button
						onClick={handleConfirm}
						className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-200"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
}

export default AlertModal;
