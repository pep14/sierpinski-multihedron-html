const dimensionSize = 2000
const a = 1000
const shapeDepth = 4;
const rotation = [-15, -30, 0];

const h = Math.sqrt(2 / 3) * a
const canvasDimensions = [dimensionSize, dimensionSize];
const shapeVertices = rotateShape([
    [0, -h * 2 / 3, 0],
    [-a / 2, h / 3, h / 3],
    [a / 2, h / 3, h / 3],
    [0, h / 3, -h * 2 / 3]
].map(v => v.map(i => i + dimensionSize / 2)), rotation);

const farColor = [255, 255, 255];
const nearColor = [0, 0, 0];



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.setAttribute("width", canvasDimensions[0]);
canvas.setAttribute("height", canvasDimensions[1]);

const tetrahedronIndices = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
];

function degToRad(deg) {
    return (deg * Math.PI) / 180;
}

function rotatePoint(point, pivot, rotation) {
    const [sinx, cosx, siny, cosy, sinz, cosz] = rotation;

    let x = point[0] - pivot[0];
    let y = point[1] - pivot[1];
    let z = point[2] - pivot[2];

    let sy = y * cosx - z * sinx;
    let sz = y * sinx + z * cosx;
    y = sy;
    z = sz;

    let sx = x * cosy + z * siny;
    sz = -x * siny + z * cosy;
    x = sx;
    z = sz;

    sx = x * cosz - y * sinz;
    sy = x * sinz + y * cosz;
    x = sx;
    y = sy;

    return [x + pivot[0], y + pivot[1], z + pivot[2]];
}

function rotateShape(vertices, rotation) {
    const [x, y, z] = rotation.map(degToRad);

    const pivot = [dimensionSize / 2, dimensionSize / 2, dimensionSize / 2];
    return vertices.map(v => rotatePoint(v, pivot, 
        [
            Math.sin(x), Math.cos(x),
            Math.sin(y), Math.cos(y),
            Math.sin(z), Math.cos(z),
        ]
    ));
}

function avgVertices(v1, v2) {
    return v1.map((v, i) => (v + v2[i]) / 2);
}

function getZIndex(face) {
    var sum = 0;
    face.map(v => sum += v[2]);
    return sum / 3;
}

function generateFaces(depth, vertices) {
    if (!depth) {
        return tetrahedronIndices.map(j => {
            const faceVertices = j.map(i => vertices[i]);
            return [...faceVertices, getZIndex(faceVertices)]
        });
    } else {
        return [0, 1, 2, 3].flatMap(i => generateFaces(
            depth - 1,
            vertices.map(v => avgVertices(v, vertices[i]))
        ));
    }
}

function interpolateRGB(d) {
    return [
        farColor[0] + (nearColor[0] - farColor[0]) * d,
        farColor[1] + (nearColor[1] - farColor[1]) * d,
        farColor[2] + (nearColor[2] - farColor[2]) * d
    ];
}

function orderFaces(faces) {
    return [...faces].sort((a, b) => a[3] - b[3]);
}

function render() {
    const faces = orderFaces(generateFaces(shapeDepth, shapeVertices));

    console.log(faces)
    for (const face of faces) {
        const color = interpolateRGB(face[3] / dimensionSize);

        ctx.fillStyle = ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(face[0][0], face[0][1]);
        ctx.lineTo(face[1][0], face[1][1]);
        ctx.lineTo(face[2][0], face[2][1]);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
    }
    
}

render()