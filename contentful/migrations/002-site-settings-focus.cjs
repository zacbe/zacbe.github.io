// Adds `focus` to Site settings: the home intro's "I build [focus] by day" phrase.
//   npm run migrate -- contentful/migrations/002-site-settings-focus.cjs

/** @param {import('contentful-migration').default} migration */
module.exports = function (migration) {
  const site = migration.editContentType('siteSettings')
  site
    .createField('focus')
    .name('Focus')
    .type('Symbol')
    .validations([{ size: { max: 120 } }])
  site.moveField('focus').afterField('location')
  site.changeFieldControl('focus', 'builtin', 'singleLine', {
    helpText: 'Completes the home intro: “I build ___ by day”. E.g. “payment APIs”.',
  })
}
