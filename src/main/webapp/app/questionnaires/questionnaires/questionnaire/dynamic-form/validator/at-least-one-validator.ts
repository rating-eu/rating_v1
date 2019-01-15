export const atLeastOneValidator = () => {
    return (formGroup) => {
        const controls = formGroup.controls;

        if (controls) {
            // Check if there is at least one answer
            const theOne = Object.keys(controls).find((key) => controls[key].value !== '' && controls[key].value !== undefined && controls[key].value !== null);

            if (!theOne) {
                return {
                    message: 'At least one answer is needed!'
                };
            }
        }
        return null;
    };
};
