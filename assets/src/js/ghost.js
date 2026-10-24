import GhostContentAPI from '@tryghost/content-api';

/* -----------------------------------------------------------------------------
Get Content Api
----------------------------------------------------------------------------- */
export function getContentApi() {
  return new GhostContentAPI({
    url: THEME_CONFIG.SITE_URL,
    key: THEME_CONFIG.CONTENT_API_KEY,
    version: THEME_CONFIG.API_VERSION
  });
}


/* -----------------------------------------------------------------------------
Get Posts
----------------------------------------------------------------------------- */
export async function getPosts({limit,include,fields,filter,formats,order} = {}) {
  const api = getContentApi()

  const config = {
    limit: limit ? limit : 100,
    include: include ? include : 'tags,authors',
    fields: fields ? fields : 'url,slug,title,featured,feature_image,published_at,excerpt,custom_excerpt',
    filter: filter ? filter : '',
    formats: formats ? formats : '',
    order: order ? order : 'published_at desc'
  }

  // fetch posts
  try {
    const posts = await api.posts
    .browse({
      limit: config.limit, 
      include: config.include,
      fields: config.fields,
      filter: config.filter,
      formats: config.formats,
      order: config.order
    });
    return posts;
  } catch (err) {
    console.log(err);
  }
}

/* -----------------------------------------------------------------------------
Get Member Newsletters
----------------------------------------------------------------------------- */
export async function getMemberNewsletters() {
  try {
    const member = await fetch(`${THEME_CONFIG.SITE_URL}/members/api/member/`);

    // Check if the response is ok first
    if (!member.ok) {
      throw new Error(`HTTP error! status: ${member.status}`);
    }

    // Parse the JSON response directly
    const data = await member.json();
    
    return data.newsletters;
  } catch (error) {
    console.error('Error fetching member newsletters:', error);
    //throw error; // Re-throw to handle it in the calling code
  }
}

/* -----------------------------------------------------------------------------
Update Member Newsletters
----------------------------------------------------------------------------- */
export async function updateMemberNewsletters(newsletters) {
  try {
    const response = await fetch(`${THEME_CONFIG.SITE_URL}/members/api/member/`, {
      method: 'PUT', // Use PUT for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletters: newsletters, // Send the updated newsletters list as the payload
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to update newsletters: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response data
    return data; // Optionally return the updated member data if needed
  } catch (error) {
    console.error('Error updating newsletters:', error);
    throw error; // Rethrow error to handle it outside the function
  }
}