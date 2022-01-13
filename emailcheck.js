const emailBtn = document.getElementById("emailButton");
const inputText = document.querySelector(".htmlinput");
const calcedArea = document.querySelector(".calculatedArea");
const displayArea = document.querySelector(".displayArea");
const fontSize = document.getElementById("fontSize");
const errorsFound = document.querySelector('.errorsFound')
const languageCheck = document.querySelector('.languagecheck')
const mainpresentation = document.querySelector('.mainTag')
const imageCheck = document.querySelector('.imageCheck');

let preInput = "";
let newString = "";
let ftSz = 8;

emailBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // mainpresentation.innerHTML = "";
  errorsFound.innerHTML = ""
  langCharCheck()
  specialCharCheck()
  imagePath();
});

//Check for language declaration, role="main" in email
const langCharCheck = () => {
  let htmlOrgArray = inputText.value.split("\n")
  let mainLines = [];
  let langDesc = "";
  let mainTagCheck = false;
  let mainTag = "";


  htmlOrgArray.forEach(line => {

    //Checking for lang=... 
    if (line.includes ('<html')) {
      const htmlIndex = htmlOrgArray.indexOf(line)+1
      if (line.includes('lang="en"') ) {
        langDesc =  `✅ Line ${htmlIndex}: LANGUAGE Declared - English`
      } else if (line.includes('lang="es"')) {
        langDesc = `✅ Line ${htmlIndex}: LANGUAGE Declared - Spanish`
      } else if (line.includes('lang="fr"')) {
        langDesc = `✅ Line ${htmlIndex}: LANGUAGE Declared - French`
      } else {
        langDesc = `❌ Line ${htmlIndex}: Error in Language declaration in in HTML string`
      }
      
    }
    //Checking for role='main' tag
    
    if (line.includes('role="main"')) {
      if (!mainTagCheck) {
        mainLines.push(htmlOrgArray.indexOf(line)+1)
        mainTagCheck = true;
        mainTag = `✅  Line ${htmlOrgArray.indexOf(line)+1}: role="main" tag Found`
      } else {
        mainLines.push(htmlOrgArray.indexOf(line)+1)
        mainTag = `❌  Multiple role="main" tags found on Lines ${mainLines}. Please check your work. `
      }
    } 
  })

  languageCheck.style.display = 'inherit';
  mainpresentation.style.display="inherit";
  const langdetail = document.createElement('p')
  const presdetail = document.createElement('p')
  langdetail.classList.add('langdetail')
  langdetail.innerHTML = langDesc
  presdetail.innerHTML = mainTag;

  languageCheck.innerHTML= "<h1>HTML Language Declared</h1>"

  languageCheck.appendChild(langdetail)
  mainpresentation.innerHTML = '<h1 class="heading">Role="main"</h1>'
  mainpresentation.appendChild(presdetail);

}

//Check for special characters within email
const specialCharCheck = () =>  {
    let htmlOrgArray = inputText.value.split("\n")
    let bodyOfEmail = [];
    let bodyStart = 0;
    let bodyEnd = 1;
    let forbiddenChars = ['†', '&', 'í', 'á', 'à', 'é', 'è', 'ó', 'ò', 'ú', 'ñ', '*', '‡', '©', '®', '¡', '¿', '§', '–', '—', '™' ]


    //Discover where body tags are in the document
    htmlOrgArray.forEach((line, i) => {
      if (line.includes('<body')) {
        bodyStart += i;
      }
      if (line.includes('</body')) {
        bodyEnd += i;
        
      }
    })


    //Loop thru lines in body to find forbidden characters
    for(let i = bodyStart; i < bodyEnd; i++) {
      let tempObj = {}
      tempObj.Line = i+1;
      htmlOrgArray[i] !== undefined ? tempObj.value = htmlOrgArray[i] : tempObj.value = ''

      tempObj.carryOver = false;
      bodyOfEmail.push(tempObj)
    } 

    const h1 = document.createElement('h1');
      h1.classList.add("heading")
      h1.innerHTML= `<h3 class="heading">Character Check</h3>`
      errorsFound.appendChild(h1)


  bodyOfEmail.forEach((obj, i) => {

    //FIND SPACE BEFORE ANY TYPE BEGINS
    let tabCount = 0;
    
    for (let j = 0; j < obj.value.length; j++) {
      if (obj.value[j].charCodeAt(0) === 9) {
        tabCount++
      }
    }
  
    let spaceCount = tabCount * 4;

    //CREATE ARRAYS FOR CARROTS TO ONLY WORK ON TYPE BETWEEN ATTRIBUTES
    // let code = obj.value.trim();
    let arrLeft = []
    let arrRight = []
    

    for (let i = 0; i < obj.value.length; i++) {
      if (obj.value[i] === "<") {
        arrLeft.push(i)
      }
      if (obj.value[i] === '>') {
        arrRight.push(i)
      }
    }
    // console.log(`Array left: length is ${arrLeft.length} - ${arrLeft}. Array Right Carrots: length is ${arrRight.length} - ${arrRight}`)

    //Checking for 'carryover' carrot to another line
    if (arrLeft[arrLeft.length -1] > arrRight[arrRight.length -1]) {
      obj.carryOver = true;
    }

    
    // console.log(`Line ${obj.Line}: ${arrLeft}, ${arrRight}. Carryover is ${obj.carryOver}. Text is ${obj.value}`)

    
    //Searching for characters depending upon the carrot Arrays
    let newCode = '';
    

    //OPTION 1: Even carrots, text with them
     
    if (arrLeft.length === arrRight.length && arrLeft[0] <= arrRight[0]) {
      //Option 2a: text before first < carrot
      if (arrLeft[0] > 1) {
        newCode += obj.value.slice(0, arrLeft[0])
      }
      //Option 2b - adding text that is in between > and < carrots
      for (let i = 0; i < arrLeft.length; i++) {
        newCode += obj.value.slice(arrRight[i]+1, arrLeft[i+1])
      } 
    // OPTION 2c: adding text after last > carrot
    } else if (arrLeft.length === arrRight.length && arrLeft[0] < arrRight[0] && arrLeft[-1] < arrRight[-1] && arrRight[-1] < obj.value.length) {
      newCode = obj.value.slice(arrRight[-1])
      // console.log(`Line ${obj.Line}: ${newCode.trim()} - `)
    }
    //OPTION 3: Clean carrot open and close
    else if (arrLeft.length === 1 && arrRight.length === 1 && arrLeft[0] > arrRight[0]) {
      newCode = obj.value.slice(arrRight[0]+1, arrLeft[0])
    
    //OPTION 4: out of order carrots but even  
    }else if (arrLeft.length === arrRight.length && arrRight[0] < arrLeft[0]) {

      for (let j = 0; j < arrLeft.length; j++) {
        newCode += obj.value.slice(arrRight[j], arrLeft[j])
      }
    

    
    // Uneven Carrots 
    } else if (arrLeft.length != arrRight.length) {
      obj.carryOver = true;
      let largestArr = 0;

      arrLeft.length > arrRight.length ? largestArr = arrLeft.length : largestArr = arrRight.length;

      //No carrots on left side
      if (arrLeft.length === 0 && arrRight.length === 1) {
        let index = obj.value.indexOf('>')+1
        newCode = obj.value.slice(index)
      //No carrots on right side
      } else if (arrRight.length === 0 && arrLeft.length === 1) {
        let index = obj.value.indexOf('<')
        newCode = obj.value.slice(0, index)
      }
    // No carrots, with carryover
    } else if (bodyOfEmail[i-1].carryOver === true) {
      newCode = '';
      // no carrots, no un-evens
    } 
    else {
      newCode = obj.value;
    }

    //Cutting blank spaces before/after first word(s)
    if (newCode.trim().length > 0) {
      let columnNumber = 0; 
      let errorCount = 0; 

      

      //Looping thru forbidden chars array from above
      forbiddenChars.forEach((char) => {
        let arr = newCode.trim().split(' ')
        
        
        arr.forEach(word => {

          if (word.includes(char)) {
            errorCount++


     
              //Searching for common HTML code, etc
              if (word.includes('&#') || word.includes('&amp;') || word.includes('&nbsp;') || word.includes('&copy;') || word.includes('&dagger;') || word.includes('&ndash;') || word.includes('&ndash;')) {
                return;
              } else {

                let charInWordIndx = word.indexOf(char)
                console.log(charInWordIndx, word)

                if (obj.value.includes(word)) {
                  columnNumber = obj.value.indexOf(word)+charInWordIndx
                }
                

                  // console.log(obj.Line, word)

                  
                  errorsFound.style.display = 'inherit';
                  
                  
                  const errorDiv = document.createElement('div');
                  const header = document.createElement('h3');
                  const errorDetail = document.createElement('p');
                  const origText = document.createElement('p');
                  
                  errorDiv.classList.add('indiverror')
                  
                  header.classList.add("subhead")
                  
                  header.innerHTML = `❌ Forbidden Character: <span style="font-size: 28px;">${char}</span><span style="color: red; font-size: 20px;"> Line ${obj.Line}</span> column ${columnNumber+1}`
                  errorDetail.classList.add('errornote')
                  errorDetail.innerText = `Replace with &#${char.charCodeAt(0)};`
                  origText.classList.add('origtext')
                  origText.innerHTML = `<u>Reference text:</u> ${newCode}`
    
                  errorsFound.appendChild(errorDiv)
                  
                  errorDiv.appendChild(header)
                  errorDiv.appendChild(errorDetail)
                  errorDiv.appendChild(origText)
              }
              
          }
        })
      })

     
    }
  })
}

//Check <img> tag 
const imagePath = () => {
  let htmlOrgArray = inputText.value.split("\n")
  

  htmlOrgArray.forEach((line, i) => {
    if (line.includes('<img')) {
      let imgIndx = line.indexOf('<img')
      let imgEndIndx = 0;
      let lineNum = 0; 
      let imageFolder = false;
      let imageURL = "";
      let alt = false;
      let altText = "";
      let closingTag = false;
      
      for (let i = imgIndx; i < line.length; i++) {
        let currentLetter = line[i]
        if (line[i] === '>') {
          imgEndIndx = i+1;
          break;
          
        }
      }
      let imgTag = line.slice(imgIndx, imgEndIndx)
      lineNum = i + 1; 
      console.log(`Line ${i+1}: ${imgTag}`)

      //Check for alt
      if (imgTag.includes('alt=')) {
        alt = true;
        let altIndx = imgTag.indexOf('alt="')+5
        let altEndIndx = 0;

        for (let i = altIndx; i < imgTag.length; i++) {
          if (imgTag[i] === '"' || imgTag[i] === "'") {
            altEndIndx = i;
            break;
          }
        }

          altText = imgTag.slice(altIndx, altEndIndx)
          console.log(altText)

        
      } else {
        alt = false;
        console.log("alt is NOT included 😤")
      }

      //Check for closing tag 
      if (imgTag.includes('/>')) {
        closingTag = true;
      } else {
        closingTag = false;
      }
      
      //CHECK for img src to not be /images
      if (imgTag.includes('src="images"' || "src='images'")) {
        console.log('Img Source goes to Image folder!!😤')
        imageFolder = false;
        
      } else {
        console.log('Img Source NOT going to Image folder!!🥰')
        imageFolder = true;

        let srcIndx = imgTag.indexOf('src="')+5
        let srcEndIndx = 0;


        for (let i = srcIndx; i < imgTag.length; i++) {
          if (imgTag[i] === '"' || imgTag[i] === "'") {
            srcEndIndx = i;
            break;
          }
        }

          imageURL = imgTag.slice(srcIndx, srcEndIndx)
          console.log(imageURL)



      }

      imageCheck.style.display = 'block';

  const imgDiv = document.createElement('div');
  const header = document.createElement('h3');
  const imgdeets = document.createElement('div');
  const imagepic = document.createElement('div');
  const imagebreakdown = document.createElement('div');


  header.classList.add("subhead")
  imgDiv.classList.add('indiverror');
  imgdeets.classList.add('imgdetails');
  imagepic.classList.add('imgpic');
  imagebreakdown.classList.add('imgbreakdown');
  
    //Where line code will go
    header.innerHTML = `Line ${lineNum}`
    imagepic.innerHTML = `<img class="imgpreview" src=${imageURL} />`
    imagebreakdown.innerHTML = `<u>Source:</u> ${imageFolder ? '✅' : "❌"} ${imageURL} <br /> <u>Alt:</u> ${alt ? `✅ "${altText}"` : "❌  No alt Text!" } <br /> <u>ClosingTag:</u> ${closingTag ? '✅ - has "/>"' : '❌ - does not have "/>"'}`
    //Where picture/no picture will go
    

    imageCheck.appendChild(imgDiv)
    
    imgDiv.appendChild(header)
    imgDiv.appendChild(imgdeets)
    imgdeets.appendChild(imagepic)
    imgdeets.appendChild(imagebreakdown)

    }
  
  })
  

  

}



