"use strict";
// ========== Tab Logic ========== //
var tabclass = document.querySelectorAll("#worked-tabs .tab");

// Assign all tabs an onclick function, passing along the one that was clicked
for(var i = 0; i < tabclass.length; i++) 
{
    tabclass[i].onclick = function() {switchTabs(this)};
}

// Tab Switching Function
function switchTabs(el) {
    var clickedid = el.id.split("-")[2];
    for(var x = 0; x < tabclass.length; x++) 
    {
        tabclass[x].classList.remove("active");
        var removecontent = "worked-tabbed-content-" + (x+1);
        document.getElementById(removecontent).classList.remove("active-content");
    }
    el.classList.add("active");
    var showpanel = "worked-tabbed-content-" + clickedid;
    document.getElementById(showpanel).classList.add("active-content");
}
// ========== Tab Logic - End ========== //



// ========== Modal Logic ========== //
var modal = document.getElementById('afmodal');
var modalcontent = document.getElementById('modal-content-container');
var modalBtn = document.querySelectorAll(".projects-tile");
var closeBtn = document.getElementsByClassName('closeBtn')[0];
var modalheader = document.getElementById("modal-header");
var modalcarousel = document.getElementById("modal-carousel");
var slidebuttons = document.getElementById("modal-slide-buttons");
var isTitle = 0;
var currentslide = 0;

// Apply onclick event to all tiles
for(var j = 0; j < modalBtn.length; j++) 
{
    modalBtn[j].onclick = function() {openModal(this)};
}

// Add click listener to both the close button and clicking outside the modal
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open modal
function openModal(el){
    var clickedid = el.id.split("-")[2];
    // Get JSON data
    fetch('https://s3.us-east-2.amazonaws.com/afergusonjr.com/json/modal-data.json')
        .then(response => response.json())
        .then(data => {
            fillModalInformation(data, clickedid)
        });

    modal.style.display = 'flex';
    window.setTimeout(function() {
        modal.classList.add("modal-show-content")
    }, 50);
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0 10px 0 0";
    document.getElementById("site-navigation").style.left = "-10px";
    document.getElementById("site-navigation").style.paddingLeft = "5px";
    document.getElementById("site-navigation").style.paddingRight = "5px";
}

// Close modal
function closeModal(){
    window.setTimeout(function() {
        modal.style.display = 'none';
    }, 200);
    modal.classList.remove("modal-show-content")
    resetmodal();
}

// Click outside modal
function outsideClick(e) {
    if(e.target == modal)
    {
        window.setTimeout(function() {
            modal.style.display = 'none';
        }, 200);
        modal.classList.remove("modal-show-content")
        resetmodal();
    }
}

// Reset all the information on the modal when closing out
function resetmodal() {
    currentslide = 0;
    modalheader.removeChild(modalheader.lastChild);
    while (modalcarousel.firstChild) 
    {
        modalcarousel.removeChild(modalcarousel.lastChild);
    }
    while (slidebuttons.firstChild) 
    {
        slidebuttons.removeChild(slidebuttons.lastChild);
    }
    document.body.style.overflow = "auto";
    document.body.style.margin = "0";
    resetNav();
}

function fillModalInformation(data, idnum) {
    var modalnum = Object.keys(data)[idnum-1];
    var headername = Object.keys(data[modalnum])[0];
    var carousellength = Object.keys(data[modalnum][headername]).length;
    var carouselcontainer = document.querySelectorAll(".carousel")[0];

    // Append Header
    var modalheaderel = document.createElement("h2");
    modalheaderel.appendChild(document.createTextNode(headername));
    modalheader.appendChild(modalheaderel);
    
    // Start looping through all slides
    for(var x = 0; x < carousellength; x++)
    {
        var slidenum = "slide-" + (x+1);
        var projectslide = document.createElement("div");
        projectslide.classList.add('projectslide');
        var title = data[modalnum][headername][slidenum]["title"];
        var description = data[modalnum][headername][slidenum]["description"];
        var techused = data[modalnum][headername][slidenum]["techused"];
    
        // Append Title if one exists to the body
        if(title != "NA")
        {
            isTitle = 1;
            var modaltitlediv = document.createElement("div");
            modaltitlediv.classList.add('modal-title');
            var modaltitlespan = document.createElement("span");
            modaltitlespan.appendChild(document.createTextNode(title));
            modaltitlediv.appendChild(modaltitlespan);
            projectslide.appendChild(modaltitlediv);
        }

        // Append Image
        var modalimagediv = document.createElement("div");
        modalimagediv.classList.add('modal-image');
        var modalimagelink = document.createElement("a");
        modalimagelink.classList.add('modal-image-link');
        var modalimage = document.createElement("img");
        modalimage.classList.add('modal-image-source');
         
        modalimagelink.setAttribute("href", "./images/modal-" + idnum + "/" + slidenum + "-full.jpg");
        modalimagelink.setAttribute("target", "_blank");
        modalimage.src = "./images/modal-" + idnum + "/" + slidenum + ".jpg";
    
        modalimagelink.appendChild(modalimage);
        modalimagediv.appendChild(modalimagelink);
        projectslide.appendChild(modalimagediv);

        // Append help text under image
        var modalimagehelp = document.createElement("div");
        modalimagehelp.classList.add('modal-image-link-helptext');
        modalimagehelp.appendChild(document.createTextNode("(Click on image to see full size)"));
        projectslide.appendChild(modalimagehelp);

        // Append Description
        var modaldesc = document.createElement("div");
        modaldesc.classList.add('modal-description');
        modaldesc.appendChild(document.createTextNode(description));
        projectslide.appendChild(modaldesc);

    
        // Append Skills
        var modaltechused = document.createElement("div");
        modaltechused.classList.add('modal-technologies-used');
        var modaltechusedtext = document.createElement("div");
        modaltechusedtext.appendChild(document.createTextNode("Technologies Used"));
        modaltechused.appendChild(modaltechusedtext);
        var modalskillscontainer = document.createElement("div");
        modalskillscontainer.classList.add('modal-skills-container');
        for(var i = 0; i < techused.length; i++) 
        {
            var modalskills = document.createElement("div");
            modalskills.appendChild(document.createTextNode(techused[i]));
            modalskillscontainer.appendChild(modalskills);
        }
        modaltechused.appendChild(modalskillscontainer);
        projectslide.appendChild(modaltechused);
        carouselcontainer.appendChild(projectslide);

        if(carousellength > 1)
        {
            var slidebutton = document.createElement("div");
            slidebutton.classList.add('modal-slide-button');
            slidebutton.id = 'modal-button-' + (x+1);
            slidebuttons.appendChild(slidebutton);
        }
    }

    // Add Next and Previous buttons w/click listener if there are more than one slide
    var allslides = document.getElementsByClassName('projectslide');
    if(allslides.length > 1) 
    {
        var nextbutton = document.createElement("div");
        nextbutton.classList.add('carousel-button-next');
        var prevbutton = document.createElement("div");
        prevbutton.classList.add('carousel-button-prev');
        carouselcontainer.appendChild(nextbutton);
        carouselcontainer.appendChild(prevbutton);
        document.getElementsByClassName('carousel-button-next')[0].addEventListener('click', function() {
            currentslide = (currentslide == (allslides.length-1)) ? 0 : currentslide+1;
            changeSlide();
        });
        document.getElementsByClassName('carousel-button-prev')[0].addEventListener('click', function() {
            currentslide = currentslide == 0 ? allslides.length-1 : currentslide-1;
            changeSlide();
        });
    }

    buildCarousel(carousellength);
}
// ========== Modal Logic - End ========== //



// ========== Carousel ========== //
// Global vars
var carousellength = 0;
var allslides = '';
var allbuttons = '';

// Instantiate carousel based on tile clicked
function buildCarousel(slidenums) {
    carousellength = slidenums;
    document.getElementsByClassName('projectslide')[0].classList.add("active");
    document.getElementsByClassName('modal-slide-button')[0].classList.add("active");
    allslides = document.getElementsByClassName('projectslide');
    allbuttons = document.getElementsByClassName('modal-slide-button');
}

function changeSlide() {
    if(allslides.length > 1)
    {
        for(var i = 0; i < allslides.length; i++)
        {
            allslides[i].classList.remove('active');
            allbuttons[i].classList.remove('active');
        }
        allslides[currentslide].classList.add('active');
        allbuttons[currentslide].classList.add('active');
    }
}

// Mobile Slide Support
let touchstartX = 0;
let touchendX = 0;
let changehappened = 0;

const slider = document.getElementById('modal-carousel');

function handleGesure() {
    if (touchstartX - touchendX > 40) 
    {
        currentslide = (currentslide == (allslides.length-1)) ? 0 : currentslide+1;
        changehappened = 1;
    } 
    if (touchendX - touchstartX > 40) 
    {
        currentslide = currentslide == 0 ? allslides.length-1 : currentslide-1;
        changehappened = 1
    }
    if (changehappened == 1)
    {
        changehappened == 0;
        changeSlide();
    }
}

slider.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

slider.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  handleGesure()
})

// Projects Hover Effect
var projecttiles = document.querySelectorAll(".projects-tile");
for(var z = 0; z < projecttiles.length; z++) 
{
    projecttiles[z].onmouseover = function() {projectTileHoverOver(this)};
    projecttiles[z].onmouseout = function() {projectTileHoverExit(this)};
}

function projectTileHoverOver(el) {
    var hoverid = el.id.split("-")[2];
    for(var x = 0; x < projecttiles.length; x++) 
    {
        projecttiles[x].classList.toggle("projects-tiles-blur");
    }
    var showproject = "projects-tile-" + hoverid;
    document.getElementById(showproject).classList.add("projects-tile-hover");
}

function projectTileHoverExit(el) {
    var hoverid = el.id.split("-")[2];
    for(var x = 0; x < projecttiles.length; x++) 
    {
        projecttiles[x].classList.toggle("projects-tiles-blur");
    }
    var showproject = "projects-tile-" + hoverid;
    document.getElementById(showproject).classList.remove("projects-tile-hover");
}

// Contact Me AJAX logic
var timoutTime = 0;
window.addEventListener("DOMContentLoaded", function() {

    // get the form elements defined in your form HTML above
    var form = document.getElementById("my-form");
    var button = document.getElementById("my-form-button");
    var status = document.getElementById("my-form-status");

    // Success and Error functions for after the form is submitted
    function success() {
      form.reset();
      button.style = "display: none ";
      status.innerHTML = "Thank you for contacting me!";
      timoutTime = 1500;
      closeModalContact()
    }

    function error() {
      status.innerHTML = "Oops! There was a problem.";
    }

    // handle the form submission event
    form.addEventListener("submit", function(ev) {
      ev.preventDefault();
      var data = new FormData(form);
      ajax(form.method, form.action, data, success, error);
    });
});
  
// helper function for sending an AJAX request
function ajax(method, url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            success(xhr.response, xhr.responseType);
        } else {
            error(xhr.status, xhr.response, xhr.responseType);
        }
    };
    xhr.send(data);
}

// ========== Modal Contact Logic ========== //
var modalContact = document.getElementById('afmodal-contact');
var modalContactcontent = document.getElementById('modal-contact-content-container');
var modalContactBtn = document.querySelectorAll('.contactme');
var closeContactBtn = document.getElementsByClassName('closeBtn')[1];
var modalContactheader = document.getElementById("modal-content-header");

// Apply onclick event
for (const button of modalContactBtn)
{
    button.onclick = function() {openModalContact(this)};
}


// Add click listener to both the close button and clicking outside the modal
closeContactBtn.addEventListener('click', closeModalContact);
window.addEventListener('click', outsideClickContact);

// Open modal
function openModalContact(el) {
    modalContact.style.display = 'flex';
    window.setTimeout(function() {
        modalContact.classList.add("modal-show-content")
    }, 50);
    document.body.style.overflow = "hidden";

    // Since there is no scroll bar on mobile/tablet, this will only apply to desktop
    if(screen.width > 1100)
    {
        document.body.style.margin = "0 10px 0 0";
        document.getElementById("site-navigation").style.left = "-10px";
        document.getElementById("site-navigation").style.paddingLeft = "5px";
        document.getElementById("site-navigation").style.paddingRight = "5px";
    }
}

// Close contact modal
function closeModalContact() {
    window.setTimeout(function() {
        window.setTimeout(function() {
            modalContact.style.display = 'none';
        }, 200);
        modalContact.classList.remove("modal-show-content")
        document.body.style.overflow = "auto";
        document.body.style.margin = "0";
        resetNav();
    }, timoutTime);
}

// Click outside contact modal
function outsideClickContact(e) {
    if(e.target == modalContact)
    {
        window.setTimeout(function() {
            modalContact.style.display = 'none';
        }, 200);
        modalContact.classList.remove("modal-show-content")
        document.body.style.overflow = "auto";
        document.body.style.margin = "0";
        resetNav();
    }
}

function resetNav() {
    document.getElementById("site-navigation").style.left = "0px";
    document.getElementById("site-navigation").style.paddingLeft = "0px";
    document.getElementById("site-navigation").style.paddingRight = "0px";
}

// Navbar navigation 
const links = document.querySelectorAll("a.nav-link");
const navsections = document.querySelectorAll(".nav-section");

for (const link of links) {
  link.addEventListener("click", clickHandler);
  if(link.id == "navhome") {link.classList.add('nav-active');}
}

function clickHandler(e) {
    e.preventDefault();
    var clickedid = this.id;
    const href = this.getAttribute("href");
    var offsetTop = document.querySelector(href).offsetTop;

    if(clickedid == "navskills")
    {
        if(screen.width > 1100) 
        {
            offsetTop = offsetTop - 190;
        }
        else
        {
            offsetTop = offsetTop - 80;
        }
    }
    scroll({
        top: offsetTop,
        behavior: "smooth"
    });

    for (const link of links) {
        link.classList.remove('nav-active');
    }
    this.classList.add('nav-active');
}

// Add event listener and function for highlighting the upper nav on scroll
let scrollpos = 0;
window.addEventListener('scroll', function(e) {
    scrollpos = window.scrollY;
    var skillsoffset = 190;
    if(screen.width > 1100) 
    {
        skillsoffset = 190;
    }
    else
    {
        skillsoffset = 80;
    }
    for (const section of navsections) {
        var sectionscroll = section.offsetTop;

        // Check to see if we're at the bottom of the page
        if ((window.innerHeight + window.scrollY) > document.body.scrollHeight) 
        {
            for (const link of links) {
                link.classList.remove('nav-active');
                if(link.getAttribute('href') == ("#" + section.id)) 
                {
                    link.classList.add('nav-active');
                }
            }
        }

        // Check to see if we are at skills section, since it's offset
        if (scrollpos >= (sectionscroll - skillsoffset) && section.id == "skills") 
        {
            for (const link of links) {
                link.classList.remove('nav-active');
                if(link.getAttribute('href') == ("#" + section.id)) 
                {
                    link.classList.add('nav-active');
                }
            }
        }

        // Checking to see if we are at any other sections like home and projects
        if (scrollpos >= sectionscroll)
        {
            for (const link of links) {
                link.classList.remove('nav-active');
                if(link.getAttribute('href') == ("#" + section.id)) 
                {
                    link.classList.add('nav-active');
                }
            }
        }
    }
});