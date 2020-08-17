const deepMap = require('deep-map');
const branch_info = require('./pantheon-branchname');

const filterUrls = entities => {
  const regex = new RegExp(`https?:\/\/${branch_info.pantheon_environment_url}`);
  const regex_netlify = new RegExp(`https?:\/\/(?:.+--)?${branch_info.netlify_url}`);
  return deepMap(entities, (value, key) => {
    if (key === 'url') {
      value = value.replace(regex, '');
      value = value.replace(regex_netlify, '');
      value = value.replace(/https?:\/\/cpcom3.lndo.site/, '');
    }
    return value;
  });
}

const addTaxonomy = (entities, tax_name, post_type) => {
  const all_terms = entities.filter(e => e.__type === `wordpress__wp_${tax_name}`);
  return entities.map(e => {
    if (e.__type === `wordpress__wp_${post_type}`) {
      let hasTerms = e[tax_name] && Array.isArray(e[tax_name]) && e[tax_name].length;
      if (hasTerms) {
        e[`${tax_name}___NODE`] = e[tax_name].map(c => all_terms.find(t => c === t.wordpress_id).id);
        delete e[tax_name];
      }
    }
    return e;
  })
}

const addJobLocations = entities => {
  return addTaxonomy(entities, 'job_location', 'jobs');
}

const addLocations = entities => {
  return addTaxonomy(entities, 'department', 'people');
}

const addTenure = entities => {
  return deepMap(entities, (value, key) => {
    if (key === 'tenure') {
      value = value || "";
    }
    return value;
  })
}

const fixSeoImages = entities => {
  return deepMap(entities, (value, key) => {
    if (key === 'og_image' || key === 'tw_image' || key === 'yoast_wpseo_opengraph_image' || key === 'yoast_wpseo_twitter_image') {
      if (value) console.log(`\tUpdating [${key}] which has value: [${value}]`);
      value = {
        localFile: {
          publicURL: value
        }
      }
    }

    return value;
  })
}

const normalizers = [filterUrls, addJobLocations, addLocations, addTenure, fixSeoImages];

module.exports = ({ entities }) => {
  console.log('');
  let transformedEntities = entities;
  normalizers.forEach(normalizer => {
    console.log('performing normalizer: '+normalizer.name);
    transformedEntities = normalizer(transformedEntities);
  });
  return transformedEntities;
}