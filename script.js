const selectFileBtn = document.getElementById('selectFileBtn');
const fileInput = document.getElementById('imagePicker');
const designContainer = document.getElementById('design-container');
const letterSpacing = document.getElementById("letter-spacing");
const textOutline = document.getElementById("text-outline");
const imageElement = document.getElementById('image-element');
var textbox = new fabric.Textbox("", { top: 10, left: 10, fontSize: 14 });
const categoryTextElement = document.getElementById('categories-text');
const canvases = {};
var activeCanvas = 'front';
const tshirtList = [
    {
        title: 'Front',
        key: 'front',
        image: './images/t-shirt.png',
        containerHeight: '180px',
        containerWidth: '180px',
        position: '',
    },
    {
        title: 'Back',
        key: 'back',
        image: './images/t-shirt-back.png',
        containerHeight: '180px',
        containerWidth: '180px',
        position: '',
    },
    {
        title: 'Left Sleeve',
        key: 'left',
        image: './images/t-shirt-left.png',
        containerHeight: '85px',
        containerWidth: '85px',
        position: '',
    },
    {
        title: 'Right Sleeve',
        key: 'right',
        image: './images/t-shirt-right.png',
        containerHeight: '85px',
        containerWidth: '85px',
        position: '',
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
                canvases[activeCanvas].add(img)
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
        canvases[activeCanvas].add(textbox);
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

    canvases[activeCanvas]?.renderAll();
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
    canvases[activeCanvas].renderAll();
}

function taextOutline(ref, value) {
    ref.set('stroke', 'black');
    ref.set('strokeWidth', value);
    canvases[activeCanvas].renderAll();
}

function textFlipX() {
    // Flip horizontally
    textbox.set('flipX', !xFlip);
    xFlip = !xFlip;
    canvases[activeCanvas].renderAll();
}

function textFlipY() {
    // Flip vertically
    textbox.set('flipY', !yFlip);
    yFlip = !yFlip;
    canvases[activeCanvas].renderAll();
}
function duplicate(ref) {
    canvases[activeCanvas].add(textbox);
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
        const canva = document.createElement('canvas');
        canva.id = tshirt.key;
        canva.style.height = tshirt.containerHeight
        canva.style.width = tshirt.containerWidth
        // canva.style.display = 'none';
        designContainer.appendChild(canva);
        canvases[tshirt.key] = new fabric.Canvas(`${tshirt.key}`);
    });
}
function switchCanvas(side) {
    activeCanvas = side;
    tshirtList.forEach(shirt => {
        const canvasEl = document.getElementById(`${shirt.key}`);
        if (shirt.key === side) {
            // canvasEl.style.display = 'bloc';
        } else {
            // canvasEl.style.display = 'none';
        }
    });
}
function insertImageAstshirtEditor(item) {
    const canvasEl = document.getElementById(`${item.key}`);
    canvasEl.style.display = 'block';
    imageElement.src = item.image;
    $('#exampleModalCenter').modal('hide');
    designContainer.style.height = item.containerHeight;
    designContainer.style.width = item.containerWidth;
    switchCanvas(item.key);
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
        canvases[activeCanvas].add(img);
    });
}

// delete selected canvas
function deleteSelectedObject() {
    const activeObject = canvases[activeCanvas].getActiveObject();
    if (activeObject) {
        canvases[activeCanvas].remove(activeObject);
        canvases[activeCanvas].discardActiveObject();
        canvases[activeCanvas].renderAll();
    }
}

function exportData() {
    // var json = JSON.stringify(canvases[activeCanvas]);
    // console.log(json);
    console.log(canvases[activeCanvas].toSVG());
}