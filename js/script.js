'use strict'
const titleClickHandler = function(event) {
    console.log('Link was clicked!');
    console.log(event);

/* remove class 'active' from all article links */

/* add class 'active to the clicked link */

/* remove class 'active from all articles */

/* get 'href' attribute from the clicked link */

/* find the correct article using the selector (value of 'href' attrivute) */

/* add class 'active to the corect article */

}

const links = document.querySelectorAll('.titles a');

for(let link of links) {
    link.addEventListener('click', titleClickHandler);
}
