import { gtag } from 'https://www.googletagmanager.com/gtag/js?id=G-5T42N31QP7';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import { generateCard } from 'namso-cc-gen';
// Import any actions required for transformations.

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import * as youtube from 'googleapis';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dwhypoukl', 
  api_key: '182612282929177', 
  api_secret: 'q9bgO-elvAjAmAFV6zovDMAF1cw' 
});
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeS2tdNN6iSZM_mN_AUhP30Sg_XQJBlgk",
  authDomain: "fireaitools.firebaseapp.com",
  projectId: "fireaitools",
  storageBucket: "fireaitools.appspot.com",
  messagingSenderId: "397276992462",
  appId: "1:397276992462:web:c1cc102ebbdbf1f14c119f",
  measurementId: "G-XB4QW0271L"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics();

// Set up the YouTube API
const youtubeApi = youtube.youtube('v3');
const apiKey = 'AIzaSyD6t0RUDZKjEcPebpbiVDYsYE0vyDVDg6E';
const youtubeApiOptions = {
  auth: apiKey,
};

const fs = require('fs');
const ytdl = require('ytdl-core');
// Function to download YouTube video or audio
async function downloadYouTubeVideo(videoId, format) {
  try {
    // Get the video metadata using the YouTube API
    const response = await youtubeApi.videos.list({
      part: 'id,snippet',
      id: videoId,
    }, youtubeApiOptions);
    const videoMetadata = response.data.items[0];

    // Create a reference to the Firebase Storage file
    const storageRef = ref(storage, `youtube-videos/${videoId}.${format}`);

    // Download the video or audio file from YouTube
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const videoStream = await fetch(videoUrl);
    const videoBuffer = await videoStream.arrayBuffer();

    // Upload the video or audio file to Firebase Storage
    await storageRef.put(videoBuffer);

    // Get the download URL for the file
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
function takeScreenshot() {
    let div = document.getElementById('ssphoto');
    html2canvas(div).then(function(canvas) {
        document.getElementById('output').appendChild(canvas);
    });
}
document.getElementById('policyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Gather input values
    const companyName = document.getElementById('companyName').value;
    const websiteUrl = document.getElementById('websiteUrl').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const dataCollection = document.getElementById('dataCollection').value;

    // Generate the privacy policy
    const privacyPolicy = `
        <h3>Privacy Policy for ${companyName}</h3>
        <p>Effective date: [Insert Date]</p>
        <p>At ${companyName}, accessible from ${websiteUrl}, one of our main priorities is the privacy of our visitors.</p>
        <p>This Privacy Policy document contains types of information that is collected and recorded by ${companyName} and how we use it.</p>
        
        <h4>Information We Collect</h4>
        <p>${dataCollection}</p>
        
        <h4>Contact Us</h4>
        <p>If you have any questions about this Privacy Policy, please contact us at ${contactEmail}.</p>
    `;

    // Display the generated privacy policy
    document.getElementById('output').innerHTML = privacyPolicy;
});

document.getElementById('deobfuscateBtn').addEventListener('click', function() {
    const inputCode = document.getElementById('inputCode').value;
    
    // Initialize De4js
    const de4js = new De4js();

    // Deobfuscate the code using De4js
    de4js.deobfuscate(inputCode, {
        // Options for De4js
        beautify: true,
        unescape_strings: true,
        recover_object_path: true,
        execute_expressions: true,
        merge_strings: true,
        remove_grouping: true
    }).then(deobfuscatedCode => {
        document.getElementById('outputCode').value = deobfuscatedCode;
    }).catch(error => {
        console.error('Deobfuscation failed:', error);
    });
});

const UglifyJS = require('uglify-js');

document.getElementById('minifyBtn').addEventListener('click', function() {
    const inputCode = document.getElementById('inputCode').value;
    
    // Minify the code using UglifyJS
    const minifiedCode = UglifyJS.minify(inputCode).code;

    document.getElementById('outputCode').value = minifiedCode;
});

const cssnano = require('cssnano');

document.getElementById('minifyBtn').addEventListener('click', function() {
    const inputCode = document.getElementById('inputCode').value;
    
    // Minify the code using CSSNano
    const minifiedCode = cssnano.process(inputCode).css;

    document.getElementById('outputCode').value = minifiedCode;
});

document.getElementById('resizeBtn').addEventListener('click', function() {
    const imageInput = document.getElementById('imageInput');
    const sizeSelect = document.getElementById('sizeSelect');
    const resizedImage = document.getElementById('resizedImage');

    const file = imageInput.files[0];
    const size = sizeSelect.value;

    // Create a canvas to resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Load the image
    const img = new Image();
    img.onload = function() {
        // Resize the image
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        // Get the resized image data
        const dataURL = canvas.toDataURL();

        // Upload the resized image to Firebase Storage
        const storageRef = storage.ref('resized-images/' + file.name);
        storageRef.putString(dataURL, 'data_url').then(function(snapshot) {
            console.log('Resized image uploaded successfully!');
            resizedImage.src = dataURL;
        }).catch(function(error) {
            console.error('Error uploading resized image:', error);
        });
    };
    img.src = URL.createObjectURL(file);
});

document.getElementById('convertBtn').addEventListener('click', function() {
    const imageInput = document.getElementById('imageInput');
    const icoLink = document.getElementById('icoLink');

    const file = imageInput.files[0];

    // Convert the image to ICO format using a library like icofile.js
    const icoFile = convertImageToICO(file);

    // Upload the ICO file to Firebase Storage
    const storageRef = storage.ref('ico-files/' + file.name + '.ico');
    storageRef.put(icoFile).then(function(snapshot) {
        console.log('ICO file uploaded successfully!');
        icoLink.href = snapshot.downloadURL;
        icoLink.click();
    }).catch(function(error) {
        console.error('Error uploading ICO file:', error);
    });
});

// Function to convert an image to ICO format using icofile.js
function convertImageToICO(file) {
    const ico = require('icofile');
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        const icoData = canvas.toDataURL();
        const icoFile = ico.create(icoData, {
            width: 16,
            height: 16
        });

        return icoFile;
    };
}
const purify = require('purify-css');
document.getElementById('remove-css-btn').addEventListener('click', function() {
    const content = document.body.outerHTML;
    const css = document.styleSheets[0].cssRules;

    const purifiedCss = purify(content, css);

    const newStyleTag = document.createElement('style');
    newStyleTag.textContent = purifiedCss;
    document.head.appendChild(newStyleTag);

    console.log('Unused CSS removed!');
});
const { Gemini } = require('@google/generative-ai');
const gemini = new Gemini({
    apiKey: 'AIzaSyCy5Ww0mpUhYG8HefASikJbciQiPVG_ME4',
});

document.getElementById('generate-btn').addEventListener('click', async function() {
    const inputText = document.getElementById('input-text').value;
    const response = await gemini.generateContent({
        prompt: inputText,
        model: 'gemini-pro',
    });

    const outputHtml = response.content;
    document.getElementById('output').innerHTML = outputHtml;

    console.log('Website generated!');
});

document.getElementById('obfuscate-btn').addEventListener('click', async function() {
    const inputCode = document.getElementById('input-code').value;
    const obfuscatedCode = await de4js.obfuscate(inputCode, {
        renameGlobals: true,
        renameProperties: true,
        renameFunctions: true,
        renameVariables: true,
    });

    const outputHtml = `<pre>${obfuscatedCode}</pre>`;
    document.getElementById('output').innerHTML = outputHtml;

    console.log('Code obfuscated!');
});

const githubToken = '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';
const headers = {
    "Authorization": `token ${githubToken}`,
    'User-Agent': 'GitHub User Finder'
};

document.getElementById('git-search-btn').addEventListener('click', async function() {
    const githubUsername = document.getElementById('github-username').value;
    const apiUrl = `https://api.github.com/users/${githubUsername}`;

    try {
        const response = await fetch(apiUrl, { headers });
        const userData = await response.json();

        const outputHtml = `
            <h2>User Profile:</h2>
            <p>Username: ${userData.login}</p>
            <p>ID: ${userData.id}</p>
            <p>Profile URL: ${userData.html_url}</p>
        `;
        document.getElementById('git-sc-output').innerHTML = outputHtml;

        console.log('User data retrieved!');
    } catch (error) {
        console.error('Error:', error);
    }
});

async function generateCreditCardNumbers(bin, quantity) {
  const namsoCcGen = await import('nam so-cc-gen');

  const options = {
    bin: bin,
    quantity: quantity,
    outputFormat: 'pipe',
    includeExpirationDate: true,
    includeCvv: true,
  };

  const creditCardNumbers = await namsoCcGen.generate(options);

  return creditCardNumbers.map((card) => ({
    cardNumber: card.number,
    expirationMonth: card.expiration.month,
    expirationYear: card.expiration.year,
    cvv: card.cvv,
  }));
}
  .catch((error) => {
    console.error(error);
  });
  
const form = document.getElementById('cf-generator-form');
const imageContainer = document.getElementById('ai-image-container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const cloudflareAccountId = 'e0c371248ae87e4e5b90c02c7fb9be9e';
    const cloudflareApiToken = 'E9QMSZvRUctnrXQRRMcX6ht8H_dFzKVpsSPyZI7P';
    const firebaseConfig = {
        apiKey: 'AIzaSyAeS2tdNN6iSZM_mN_AUhP30Sg_XQJBlgk',
        authDomain: 'fireaitools.firebaseapp.com',
        storageBucket: 'fireaitools.appspot.com',
    };

    try {
        // Call the Cloudflare worker to generate an image
        const response = await fetch(`https://myai.shdc.workers.dev/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cloudflareApiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        // Get the generated image URL from the Cloudflare worker response
        const imageUrl = await response.json();

        // Upload the generated image to Firebase storage
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${prompt}.jpg`);
        await imageRef.putString(imageUrl, 'data_url');

        // Display the generated image
        const image = document.createElement('img');
        image.src = await imageRef.getDownloadURL();
        imageContainer.innerHTML = '';
        imageContainer.appendChild(image);
    } catch (error) {
        console.error(error);
    }
});

window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5T42N31QP7');
  
// Track events
function trackEvent(action, category, label) {
  gtag('event', action, {
    'event_category': category,
    'event_label': label,
  });
}

// Example usage:
trackEvent('Click', 'Buttondl', 'Download Button');

// Create a link to download a file
const fileTypes = ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'txt', 'rtf', 'csv', 'exe', 'key', 'pps', 'ppt', 'pptx', '7z', 'pkg', 'rar', 'gz', 'zip', 'avi', 'mov', 'mp4', 'mpe', 'mpeg', 'wmv', 'mid', 'midi', 'mp3', 'wav', 'wma'];
const downloadLink = document.createElement('a');
downloadLink.href = 'https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/files.' + fileTypes[0]; // Replace with actual file URL
downloadLink.download = 'file.' + fileTypes[0];
downloadLink.textContent = 'Download File';

// Add the link to the page
document.body.appendChild(downloadLink);

// Track file downloads
downloadLink.addEventListener('click', () => {
  trackEvent('Download', 'File', fileTypes[0]);
});

// Create a search form
const searchForm = document.createElement('form');
searchForm.action = '/search';
searchForm.method = 'GET';

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.name = 'q';
searchInput.placeholder = 'Search...';

searchForm.appendChild(searchInput);

// Add the form to the page
document.body.appendChild(searchForm);

// Track search queries
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value;
  trackEvent('Search', 'Query', query);
  window.location.href = `/search?q=${query}`;
});

// Add an event listener to all links on the page
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    const link = e.target;
    const href = link.href;
    trackEvent('Link', 'Click', href);
  }
});

// Create a URLSearchParams object
const params = new URLSearchParams(window.location.search);

// Get a parameter value
const paramValue = params.get('paramName');

// Track parameter values
trackEvent('Parameter', 'Value', paramValue);

// Set a value in localStorage
localStorage.setItem('key', 'value');

// Get a value from localStorage
const value = localStorage.getItem('key');

// Track localStorage values
trackEvent('LocalStorage', 'Value', value);

const generateCreditCard = () => {
  const card = generateCard();
  const cardNumber = card.number;
  const expirationMonth = card.exp_month;
  const expirationYear = card.exp_year;
  const cvv = card.cvv;

  console.log(`Card Number: ${cardNumber}`);
  console.log(`Expiration Month: ${expirationMonth}`);
  console.log(`Expiration Year: ${expirationYear}`);
  console.log(`CVV: ${cvv}`);
};

generateCreditCard();

document.getElementById('get-ip-btn').addEventListener('click', function() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip-address').textContent = `Your IP Address: ${data.ip}`;
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
        });
});


const fileInput = document.getElementById('gitfile');
    const uploadButton = document.getElementById('gitupload');
    const outputDiv = document.getElementById('gitoutput');

    uploadButton.addEventListener('click', async () => {
      const file = fileInput.files[0];

      // Validate file type
      if (!file || !['text/javascript', 'application/javascript', 'text/css'].includes(file.type)) {
        outputDiv.innerText = 'Please upload a valid JS or CSS file.';
        return;
      }

      const repo = 'ltxstudio/new-site'; // Replace with your repo
      const branch = 'main'; // Replace with your branch
      const path = 'git/files/' + file.name; // Replace with your desired path

      const url = await uploadFileToGitHub(file, repo, branch, path);
      outputDiv.innerText = url ? `File uploaded to ${url}` : 'Upload failed.';
    });

    async function uploadFileToGitHub(file, repo, branch, path) {
      try {
        const octokit = new Octokit({
          baseUrl: 'https://api.github.com',
          accessToken: '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' // Replace with your GitHub token
        });

        const blob = await octokit.request(`POST /repos/${repo}/git/blobs`, {
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          content: await file.text(), // Use file.text() to get the file content
          encoding: 'utf-8'
        });

        const tree = await octokit.request(`POST /repos/${repo}/git/trees`, {
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          tree: [
            {
              path: path,
              mode: '100644',
              type: 'blob',
              sha: blob.data.sha
            }
          ]
        });

        const commit = await octokit.request(`POST /repos/${repo}/git/commits`, {
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          message: `Upload file ${path}`,
          tree: tree.data.sha,
          parents: [branch]
        });

        await octokit.request(`PATCH /repos/${repo}/git/refs/heads/${branch}`, {
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          sha: commit.data.sha
        });

        return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
   
// Function to perform bin lookup
async function binLookup(bin) {
  try {
    const response = await fetch(`https://binlist.io/lookup/${bin}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Example usage:
const binInput = document.getElementById('binnumber');
const lookupButton = document.getElementById('binlookup');
const outputDiv = document.getElementById('binoutput');

lookupButton.addEventListener('click', async () => {
  const bin = binInput.value.trim();
  if (!bin) {
    outputDiv.innerText = 'Please enter a valid bin number.';
    return;
  }

  const data = await binLookup(bin);
  if (data) {
    outputDiv.innerText = `Bin lookup result for ${bin}:`;
    outputDiv.innerHTML += `
      <ul>
        <li>Scheme: ${data.scheme}</li>
        <li>Type: ${data.type}</li>
        <li>Brand: ${data.brand}</li>
        <li>Bank: ${data.bank.name}</li>
        <li>Country: ${data.country.name}</li>
        <li>Currency: ${data.country.currency}</li>
      </ul>
    `;
  } else {
    outputDiv.innerText = `Error: Unable to perform bin lookup for ${bin}`;
  }
});
// Create a Cloud Function to delete files older than 3 days
// Handle form submission
document.getElementById('manifestForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('mname').value;
    const shortName = document.getElementById('mshort_name').value;
    const description = document.getElementById('mdescription').value;
    const icon = document.getElementById('micon').value;
    const startUrl = document.getElementById('mstart_url').value;
    const display = document.getElementById('mdisplay').value;
    const backgroundColor = document.getElementById('mbackground_color').value;
    const themeColor = document.getElementById('mtheme_color').value;

    // Generate manifest.json content
    const manifestJson = {
        "manifest_version": 2,
        "name": name,
        "short_name": shortName,
        "description": description,
        "icons": [
            {
                "src": icon,
                "sizes": "192x192",
                "type": "image/png"
            }
        ],
        "start_url": startUrl,
        "display": display,
        "background_color": backgroundColor,
        "theme_color": themeColor
    };

    // Convert manifest.json object to a JSON string
    const manifestJsonString = JSON.stringify(manifestJson, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([manifestJsonString], { type: "application/json" });

    // Create a reference to the file you are about to create
    const fileRef = storage.ref().child("manifest.json");

    // Upload the blob into the storage file
    try {
        await fileRef.put(blob);
        document.getElementById('message').innerHTML = 'Manifest.json uploaded successfully!';
    } catch (error) {
        document.getElementById('message').innerHTML = 'Error uploading manifest.json: ' + error.message;
    }
});

const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");
let userMessage;

const API_KEY = "AIzaSyCajaqL9d7-zuozVkBiDPOTIHgpez7jiiM";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.gemini.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    role: "user",
                    content: userMessage
                }
            ]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again! ";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(in comingChatLi);
    }, 1000);

    chatInput.value = "";
};

sendChatBtn.addEventListener("click", handleChat);

// Get the input and output textareas
const input = document.getElementById('htmlinput');
const output = document.getElementById('htmloutput');

// Add event listeners to the buttons
document.getElementById('escape').addEventListener('click', escapeHTML);
document.getElementById('unescape').addEventListener('click', unescapeHTML);

// Function to escape HTML code
function escapeHTML() {
    const html = input.value;
    const escapedHtml = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    output.value = escapedHtml;
}

// Function to unescape HTML code
function unescapeHTML() {
    const html = input.value;
    const unescapedHtml = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    output.value = unescapedHtml;
}

// Get the input and output textareas
const input = document.getElementById('hminput');
const output = document.getElementById('hmoutput');

// Add event listener to the minify button
document.getElementById('hmminify').addEventListener('click', minifyHTML);

// Function to minify HTML code
function minifyHTML() {
    const html = input.value;

    // Remove comments
    const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');

    // Remove whitespace and newlines
    const minifiedHtml = withoutComments
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/>\s+</g, '><') // Remove spaces between tags
        .trim(); // Trim leading and trailing whitespace

    output.value = minifiedHtml;
}

// Get the file input and output textarea
const fileInput = document.getElementById('fileInput');
const output = document.getElementById('foutput');

// Add an event listener to the upload button
document.getElementById('uploadFile').addEventListener('click', uploadFile);

// Add an event listener to the download button
document.getElementById('downloadFile').addEventListener('click', downloadFile);

// Function to encode a file to Base64
function encodeFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = btoa(reader.result);
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsBinaryString(file);
  });
}

// Function to decode a Base64 string to a file
function decodeBase64StringToFile(base64String) {
  return new Promise((resolve, reject) => {
    const decodedData = atob(base64String);
    const blob = new Blob([decodedData], { type: 'application/octet-stream' });
    resolve(blob);
  });
}

// Function to upload a file to Firebase Storage
function uploadFileToFirebase(file) {
  const storage = firebase.storage();
  const storageRef = storage.ref('files');
  const uploadTask = storageRef.child('file.txt').put(file);

  uploadTask.on('state_changed', (snapshot) => {
    // Handle progress
  }, (error) => {
    // Handle error
  }, () => {
    // Handle success
  });
}

// Function to download a file from Firebase Storage
function downloadFileFromFirebase(fileId) {
  const storage = firebase.storage();
  const storageRef = storage.ref('files');
  const fileRef = storageRef.child(`file_${fileId}.txt`);

  fileRef.getDownloadURL().then((url) => {
    // Use the URL to download the file
  }).catch((error) => {
    // Handle error
  });
}

// Function to handle file upload
function uploadFile() {
  const file = fileInput.files[0];
  encodeFileToBase64(file).then((base64String) => {
    output.value = base64String;
    uploadFileToFirebase(file);
  }).catch((error) => {
    console.error(error);
  });
}

// Function to handle file download
function downloadFile() {
  const fileId = '1'; // Replace with the actual file ID
  downloadFileFromFirebase(fileId).then((url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.txt';
    a.click();
  }).catch((error) => {
    console.error(error);
  });
}
// Get the file input and output image
const fileInput = document.getElementById('bgfileInput');
const output = document.getElementById('bgoutput');

// Add an event listener to the remove background button
document.getElementById('removeBackground').addEventListener('click', removeBackground);

// Initialize Cloudinary
const cloudinary = require('cloudinary');
// Function to remove the background of an image using AI
function removeBackground() {
  const file = fileInput.files[0];
  cloudinary.v2.uploader.upload(file, {
    upload_preset: 'ml_default',
    background_removal: 'cloudinary_ai'
  }, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      const publicId = result.public_id;
      const url = `https://res.cloudinary.com/${cloudinary.config().cloud_name}/image/upload/${publicId}`;
      output.src = url;
    }
  });
}
