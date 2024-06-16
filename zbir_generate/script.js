document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('download').addEventListener('click', downloadImage);

var predefinedImagePath1 = 'bg.png';
var predefinedImagePath2 = 'info.png';

//Точки, між якими повинна знаходитися картинка. Якщо вона більше - ми зменшуємо картинку по більшій стороні, ресайзимо її і центруємо
var heightTop = 226;
var heigthBottom = 750;

var widthLeft = 104;
var widthRight = 490;

//Де розмістити текст по висоті
var pricePositionBottomHeight = 860;

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const userImage = new Image();
        userImage.onload = async function() {
            const resizedImage = resizeImage(userImage);
            await combineImages(resizedImage);
        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function resizeImage(image) {
    let maxWidth = widthRight - widthLeft;
    let maxHeight = heigthBottom - heightTop;

    let width = image.width;
    let height = image.height;

    if (width > height) {
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }

        //Якщо висота все одно більша, ніж нам треба - зменшимо розміри ще раз
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
    } else {
        if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
        //Якщо ширина все одно більша, ніж треба - зменшимо її ще раз
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    const resizedImage = new Image();
    resizedImage.src = canvas.toDataURL('image/png');
    return resizedImage;
}

async function combineImages(userImage) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const predefinedImage1 = new Image();
    //Шлях до фонового зображення
    predefinedImage1.src = predefinedImagePath1;

    predefinedImage1.onload = function() {
        canvas.width = predefinedImage1.width;
        canvas.height = predefinedImage1.height;

        ctx.drawImage(predefinedImage1, 0, 0);

        const predefinedImage2 = new Image();
        //Шлях до фонового зображення 2
        predefinedImage2.src = predefinedImagePath2;

        predefinedImage2.onload = async function() {
            ctx.drawImage(predefinedImage2, 0, 0);

            //Позиціонуємо картинку
            let userImageWidth = userImage.width;
            let userImageHeight = userImage.height;

            console.log(userImage.width);
            console.log(userImage.height);

            let finalPositionX = 0;
            let finalPositionY = 0;

            finalPositionX = Math.floor((widthRight - widthLeft - userImageWidth) / 2) + widthLeft;
            finalPositionY = Math.floor((heigthBottom - heightTop - userImageHeight) / 2) + heightTop;

            ctx.drawImage(userImage, finalPositionX, finalPositionY);

            //Беремо ціну
            price = parseInt(document.getElementById('price').value);

            let fontSize = 50;
            if (price >= 1000000) {
                fontSize = 45;
            } else if (price >= 100000) {
                fontSize = 48;
            }

            let fontInfo = 'bold ' + fontSize + 'px "Micra Bold"';
            await document.fonts.load(fontInfo);

            ctx.font = fontInfo;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('МОЯ ЦIЛЬ: ' + formatNumber(price) + ' ГРН', canvas.width / 2, pricePositionBottomHeight);
    
            document.getElementById('download').style.display = 'block';
            canvas.style.display = 'block';
        };
    };

    
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number).replace(/,/g, ' ');
}

function downloadImage() {
    let downloadFileName = 'сміливі мають щастя.png';
    let username = document.getElementById('username').value;
    if (username.length > 0) {
        downloadFileName = username + ' ' + downloadFileName;
    }

    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = downloadFileName;
    link.click();
}