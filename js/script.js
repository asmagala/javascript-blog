{
  'use strict';

  const opt = {
    optArticleSelector: '.post',
    optTitleSelector: '.post-title',
    optTitleListSelector: '.titles',
    optArticleTagsSelector: '.post-tags .list',
    optArticleAuthorSelector: '.post-author',
    optTagsListSelector: '.tags.list',
    optCloudClassCount: 5,
    optCloudClassPrefix: 'tag-size-',
  };

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-article-tags').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-article-authors').innerHTML),
    articlelAuthorLink: Handlebars.compile(document.querySelector('#template-article-by-author').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  };

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the corect article */
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(opt.optTitleListSelector);

    titleList.innerHTML = '';
  
    /* for each article */
    const articles = document.querySelectorAll(opt.optArticleSelector + customSelector);

    let html = '';
    for(let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opt.optTitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);

      /* insert link into html variable */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    
    for(let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = {max: 0, min: 999999};
    for(let tag in tags) {
      if(tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if(tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.optCloudClassCount - 1) + 1);
    return opt.optCloudClassPrefix + classNumber;
  }

  function generateTags() {
    /* create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(opt.optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const tagList = article.querySelector(opt.optArticleTagsSelector)

      /* make html variable with empy string */
      let html = "";
      tagList.innerHTML = html;

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray) {
      /* generate HTML of the link */
        const linkHTMLData = {id: tag};
        const linkHTML = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        html += linkHTML;
        /* check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)) {
          /* add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

      } /* END LOOP: fora each tag */

      /* insert HTML of all the links into the tags wrapper */
      tagList.innerHTML = html;

    } /* END LOOP: for every article: */

    /* find list of tags in right column */
    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);

    /* create empty allTagsData array */
    const allTagsData = {tags: []};

    /* START LOOP: for each tag in allTags: */
    for(let tag in allTags) {
      /* generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    
    } /* [NEW] END LOOP: for each tag in allTags: */

    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }

  generateTags();

  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for(activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
    } /* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let tagLink of tagLinks) {
      /* add class active */
      tagLink.classList.add('active');

    } /* END LOOP: for each found tag link */
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  function addClickListenersToTags(){
    /* find all links to tags */
    const links = document.querySelectorAll('.post-tags a, .tags a');
    /* START LOOP: for each link */
    for(let link of links) {

      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    } /* END LOOP: for each link */
  }
  
  addClickListenersToTags();

  function generateAuthors() {
    /* create variable for storing all authors */
    let allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(opt.optArticleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find author wrapper 'post-author' */
      const author = article.querySelector(opt.optArticleAuthorSelector)

      /* make html variable with empy string */
      let html = "";
      author.innerHTML = html;

      /* get authors from data-authors attribute */
      const articleAuthor = article.getAttribute('data-author');

      /* add article author to allAuthors */
      if(!allAuthors.hasOwnProperty(articleAuthor)) {
        /* if property (author) does not exist */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      /* generate HTML of the link */
      /* add generated code to html variable */
      const ahref = '#author-' + articleAuthor.replace(' ', '-');
      const articleAuthorHTMLData = { rel: ahref, articleAuthorId: articleAuthor }; 

      /* insert HTML of all the links into the author wrapper */
      const linkHTML = templates.articlelAuthorLink(articleAuthorHTMLData); 
      author.innerHTML = linkHTML;

    } /* END LOOP: for every article: */
    
    let allAuthorsHTML = '';

    for(let auth in allAuthors) {
      const ahref = '#author-' + auth.replace(' ', '-');
      const author = auth;
      const count = allAuthors[auth];

      const linkHTMLData = {rel: ahref, authorId: author, countId: count};
      const linkHTML = templates.authorLink(linkHTMLData);

      allAuthorsHTML += linkHTML;
    } /* End of For allAuthors */

    const authorsList = document.querySelector('.list.authors')
    authorsList.innerHTML = allAuthorsHTML;
  }

  generateAuthors();

  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#author-', '').replace('-', ' ');
    
    /* find all tag links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

     /* START LOOP: for each active author link */
    for(let activeAuthorLink of activeAuthorLinks) {
      /* remove class active */
      activeAuthorLink.classList.remove('active');
    } /* END LOOP: for each active tag link */

    /* find all  links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found author link */
    for(let authorLink of authorLinks) {
      /* add class active */
      authorLink.classList.add('active');

    } /* END LOOP: for each found tag link */
  
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }
  
  function addClickListenersToAuthors(){
    /* find all links to authors */
    const links = document.querySelectorAll('.post-author a, .authors a');

    /* START LOOP: for each link */
    for(let link of links) {
      /* add authorClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    } /* END LOOP: for each link */
  }
  
  addClickListenersToAuthors();

}

