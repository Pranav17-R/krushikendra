// ================================================
//  middleware/notFound.js – 404 catch-all
// ================================================
const notFound = (req, res) => {
  res.status(404).render('404', {
    title:      'Page Not Found – Trishul Krushi Kendra',
    activePage: '',
  });
};

module.exports = notFound;
