export const atLeastOneValidator = () => {
    return (formGroup) => {
        const controls = formGroup.controls;
        console.log('Validator before if');
        console.log(formGroup);


        if (controls) {
            // Check if there is at least one answer
            console.log('Inside if');
            console.log(controls);

            const theOne = Object.keys(controls).find((key) => controls[key].value !== '' && controls[key].value !== undefined && controls[key].value !== null);

            console.log('The one:');
            console.log(theOne);

            if (!theOne) {
                return {
                    message: 'At least one answer is needed!'
                };
            }
        }
        return null;
    };
};
