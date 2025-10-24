[xRotationInput, yRotationInput, zRotationInput].map(input => {
    input.addEventListener("input", function() {formatDegInput(input)});
    input.value = 0;
})

function formatDegInput(input) {
    const value = input.value.stripNonDec() % 360;

    if (value % 360 == 0) {
        input.value = 0;
    } else {
        input.value = value;
    }

    rotation = [
        xRotationInput,
        yRotationInput,
        zRotationInput,
    ].map(i => Number(i.value));

    render()
}

String.prototype.stripNonDec = function() {
    return this.replace(/[^0-9]/g, "");
}