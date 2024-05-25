const selectFileBtn = document.getElementById('selectFileBtn');
const fileInput = document.getElementById('imagePicker');
const designContainer = document.getElementById('design-container');
const letterSpacing = document.getElementById("letter-spacing");
const textOutline = document.getElementById("text-outline");
const canva = document.getElementById('canvas');
const imageElement = document.getElementById('image-element');
var canvas = new fabric.Canvas(canva);
var textbox = new fabric.Textbox("", { top: 10, left: 10, fontSize: 14 });
const categoryTextElement = document.getElementById('categories-text');
const canvasStates = {};
var currentSide = '';
const tshirtList = [
    {
        title: 'Front',
        key: 'front',
        image: './images/t-shirt.png',
        containerStyleHeight: '180px',
        containerStyleWidth: '180px',
        containerWidth: 180,
        containerHeight: 180,
        position: ''
    },
    {
        title: 'Back',
        key: 'back',
        image: './images/t-shirt-back.png',
        containerStyleHeight: '180px',
        containerStyleWidth: '180px',
        containerWidth: 180,
        containerHeight: 180,
        position: ''
    },
    {
        title: 'Left Sleeve',
        key: 'left',
        image: './images/t-shirt-left.png',
        containerStyleHeight: '85px',
        containerStyleWidth: '85px',
        containerWidth: 85,
        containerHeight: 85,
        position: ''
    },
    {
        title: 'Right Sleeve',
        key: 'right',
        image: './images/t-shirt-right.png',
        containerStyleHeight: '85px',
        containerStyleWidth: '85px',
        containerWidth: 85,
        containerHeight: 85,
        position: ''
    },
]
const artList = {
    lion: [
        "./images/art/lion/lion_face.svg",
        "./images/art/lion/lion-svgrepo-com.svg",
        "./images/art/lion/lion-svgrepo.svg",
    ],
    cat: [
        "./images/art/cat/husky-svgrepo-com.svg",
        "./images/art/cat/cat-svgrepo-com.svg",
        "./images/art/cat/cat-4-svgrepo-com.svg",
    ],
    dog: [
        "./images/art/dog/cardiogram-dog-svgrepo-com.svg",
        "./images/art/dog/dog-face-svgrepo-com.svg",
        "./images/art/dog/dog-svgrepo-com.svg",
    ],
}
var xFlip = false;
var yFlip = false;

if (designContainer) {
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageDataUrl = reader.result;
            fabric.Image.fromURL(imageDataUrl, function (img) {
                img.set({
                    left: 10,
                    top: 10,
                    scaleX: 0.2,
                    scaleY: 0.2,
                });
                canvas.add(img);
            });
        });
        reader.readAsDataURL(file);
    });
}

// function allowDrop(ev) {
//     ev.preventDefault();
// }

// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }

// function drop(ev) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     designContainer.appendChild(document.getElementById(data));
// }

$(document).ready(function () {
    $("#image-selector").hide();
    $("#edit-text").hide();
    $("#art-selector").hide();
    renderTshirts()
    insertImageAstshirtEditor(tshirtList[0])
    renderArtCategories()

    $("#image-upload").click(function () {
        $("#image-selector").show();
        $("#create-your-design").hide();
    });

    $("#design-text").click(function () {
        canvas.add(textbox);
        $("#edit-text").show();
        $("#create-your-design").hide();
    });

    $("#art-upload").click(function () {
        $("#art-selector").show();
        $("#create-your-design").hide();
    });

    $("#back-image-selector").click(function () {
        $("#image-selector").hide();
        $("#create-your-design").show();
    })
    $("#back-edit-text").click(function () {
        $("#edit-text").hide();
        $("#create-your-design").show();
    })
    $("#back-art-selector").click(function () {
        $("#art-selector").hide();
        $("#create-your-design").show();
    })
});

letterSpacing.addEventListener("input", function () {
    var value = letterSpacing.value;
    adjustLetterSpacing(textbox, value);
});

textOutline.addEventListener("input", function () {
    var value = textOutline.value;
    taextOutline(textbox, value);
});

const toolbarOptions = [
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'font': ['serif', 'monospace'] }],
    ['bold', 'italic'],
    [{ 'align': [] }],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
];
const quill = new Quill('#text-editor', {
    theme: 'snow',
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Typing here...',
    formats: [
        'size', 'font', 'bold', 'italic', 'align', 'color', 'background',
    ],
});
quill.root.style.maxHeight = '100px';
quill.root.innerHTML = '<p>Add text</p>';

quill.on('text-change', function (delta, oldDelta, source) {
    const text = quill.getContents();
    textbox.set('text', text.ops[0].insert);

    var attributes1 = text?.ops[0]?.attributes || {};
    var attributes2 = text?.ops[1]?.attributes || {};
    // console.log('1', attributes1);
    // console.log('2', attributes2);

    if (attributes1.hasOwnProperty('size')) {
        letterSpacing.value = 1;
        if (attributes1.size === 'small') {
            textbox.set('fontSize', 10);
        } else if (attributes1.size === 'large') {
            textbox.set('fontSize', 20);
        } else if (attributes1.size === 'huge') {
            textbox.set('fontSize', 30);
        } else {
            textbox.set('fontSize', 14);
        }
    } else {
        textbox.set('fontSize', 14);
    }

    if (attributes1.hasOwnProperty('bold') || attributes1.bold) {
        textbox.set('fontWeight', 'bold');
    } else {
        textbox.set('fontWeight', 'normal');
    }
    if (attributes1.hasOwnProperty('italic') || attributes1.italic) {
        textbox.set('fontStyle', 'italic');
    } else {
        textbox.set('fontStyle', 'normal');
    }
    if (attributes1.hasOwnProperty('color')) {
        textbox.set('fill', attributes1.color);
    } else {
        textbox.set('fill', '#000');
    }
    if (attributes1.hasOwnProperty('background')) {
        textbox.set('backgroundColor', attributes1.background);
    } else {
        textbox.set('backgroundColor', '');
    }
    if (attributes1.hasOwnProperty('font')) {
        console.log(attributes1.font);
        textbox.set('fontFamily', attributes1.font);
    } else {
        textbox.set('fontFamily', 'serif');
    }
    if (attributes2.hasOwnProperty('align')) {
        textbox.set('textAlign', attributes2.align);
    }

    canvas.renderAll();
});

// adjustLetterSpacing(textbox, 10);
function adjustLetterSpacing(ref, letterSpacing) {
    var newText = "";
    const text = quill.getContents();
    var textArray = text.ops[0].insert.split("");
    textArray.forEach(function (char, index) {
        newText += char + "\u200A".repeat(letterSpacing); // Use Unicode thin space character
    });
    ref.set("text", newText);
    canvas.renderAll();
}

function taextOutline(ref, value) {
    ref.set('stroke', 'black');
    ref.set('strokeWidth', value);
    canvas.renderAll();
}

function textFlipX() {
    // Flip horizontally
    textbox.set('flipX', !xFlip);
    xFlip = !xFlip;
    canvas.renderAll();
}

function textFlipY() {
    // Flip vertically
    textbox.set('flipY', !yFlip);
    yFlip = !yFlip;
    canvas.renderAll();
}
function duplicate(ref) {
    canvas.add(textbox);
    ref.set('top', 10);
    ref.set('left', 10);
}
// quill.on('selection-change', (range, oldRange, source) => {
//     if (range) {
//       if (range.length == 0) {
//         console.log('User cursor is on', range.index);
//       } else {
//         const text = quill.getText(range.index, range.length);
//         console.log('User has highlighted', text);
//       }
//     } else {
//       console.log('Cursor not in the editor');
//     }
//   });

function renderTshirts() {
    const container = document.getElementById('tshirt-container');

    tshirtList.forEach(tshirt => {
        const card = document.createElement('div');
        card.className = 'card pl-2 card-item';
        card.style.width = 'fit-content';
        const tshirtData = JSON.stringify(tshirt).replace(/"/g, '&quot;');
        const content = `
            <div style="display: flex; flex-direction: column;" onclick="insertImageAstshirtEditor(${tshirtData})">
                <strong>${tshirt.title}</strong>
                <img src="${tshirt.image}" alt="${tshirt.title}" style="height: 200px;" />
            </div>
        `;

        card.innerHTML = content;
        container.appendChild(card);
        canvasStates[tshirt.key] = null;
    });
}
function switchCanvas(side) {
    if (canvasStates[side]) {
        canvas.loadFromJSON(canvasStates[side], canvas.renderAll.bind(canvas));
    } else {
        canvas.clear(); // Clear the canvas if there's no state saved for this side
    }
}
function saveCurrentCanvasState(currentSide) {
    canvasStates[currentSide] = JSON.stringify(canvas);
}
function insertImageAstshirtEditor(item) {
    if (currentSide) {
        saveCurrentCanvasState(currentSide);
    }
    currentSide = item.key;
    imageElement.src = item.image;
    $('#exampleModalCenter').modal('hide');
    designContainer.style.height = item.containerStyleHeight;
    designContainer.style.width = item.containerStyleWidth;
    switchCanvas(item.key)
}

function renderArtCategories() {
    const container = document.getElementById('art-category');

    Object.keys(artList).forEach(key => {
        const card = document.createElement('div');
        const content = `
            <p class="p-0 m-0" style="font-size: 16px; cursor: pointer; color:blue" onclick="onClickCategoryName('${key}')">${key}</p>
        `;
        card.innerHTML = content;
        container.appendChild(card);
    });
}

function onClickCategoryName(category) {
    $("#art-category").hide();
    $("#clip-art-images").show();
    const categoryElement = document.getElementById('categories');
    categoryTextElement.style.color = 'blue';
    categoryTextElement.style.cursor = 'pointer';
    categoryTextElement.style.textDecoration = 'underline';
    const content = document.createElement('strong');
    content.innerText = ` / ${category}`;
    categoryElement.appendChild(content);
    const container = document.getElementById('clip-art-images');
    artList[category].forEach(art => {
        const card = document.createElement('div');
        const content = `
            <img src="${art}" alt="${art}" style="height: 80px; margin:10px; cursor: pointer;" onclick="addArtInContainer('${art}')" />
        `;

        card.innerHTML = content;
        container.appendChild(card);
    });
}

function onClickCategoryText() {
    $("#art-category").show();
    $("#clip-art-images").hide();
    const list = document.getElementById("categories");
    const clipArtcontainer = document.getElementById('clip-art-images');
    if (list.hasChildNodes()) {
        list.removeChild(list.children[1]);
    }
    clipArtcontainer.innerHTML = '';
    categoryTextElement.style.color = 'black';
    categoryTextElement.style.cursor = '';
    categoryTextElement.style.textDecoration = 'none';
}

function addArtInContainer(file) {
    fabric.Image.fromURL(file, function (img) {
        img.set({
            left: 10,
            top: 10,
            scaleX: 0.2,
            scaleY: 0.2,
        });
        canvas.add(img);
    });
}

// delete selected canvas
function deleteSelectedObject() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
    }
}