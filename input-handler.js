[xRotationInput, yRotationInput, zRotationInput].map(input => {
    input.addEventListener("input", function() {formatDegInput(input)});
    input.value = 0;
})

function formatDegInput(input) {
    var value = input.value.stripNonDec();

    if (value.includes("-")) value = -value.replace("-", "")

    value = ((value % 360) + 360) % 360;
    input.value = parseFloat(value.toFixed(2));

    rotation = [
        xRotationInput,
        yRotationInput,
        zRotationInput,
    ].map(i => Number(i.value));

    render()
}

String.prototype.stripNonDec = function() {
    return this.replace(/[^0-9.-]/g, "");
}