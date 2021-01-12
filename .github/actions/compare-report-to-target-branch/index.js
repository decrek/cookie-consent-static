const { getInput, setFailed, setOutput } = require('@actions/core');
const fetch = require('node-fetch');
const _ = require('@lhci/utils/src/lodash.js');
const {computeRepresentativeRuns} = require('@lhci/utils/src/representative-runs.js');
const {
  loadSavedLHRs
} = require('@lhci/utils/src/saved-reports.js');

async function main() {
  const thisBuild = JSON.parse(getInput('report'))
  const baseBuild = await getLatestBaseReport()


  console.log(thisBuild)
  console.log(';;;;;;;;;;;;;;;;;;;;;;;;')
  console.log(baseBuild)

  setOutput('lighthouseComparison', thisBuild && baseBuild ? `On this build your scores were
| Category | Current Build | Base Build | Difference
| --- | --- | --- | --- |
| Performance | ${thisBuild.categories.performance.score * 100} | ${baseBuild.categories.performance.score * 100} | ${diff(thisBuild.categories.performance.score * 100, baseBuild.categories.performance.score * 100)}|
| Accessibility | ${thisBuild.categories.accessibility.score * 100} | ${baseBuild.categories.accessibility.score * 100} | ${diff(thisBuild.categories.accessibility.score * 100, baseBuild.categories.accessibility.score * 100)}|
| Best Practices | ${thisBuild['best-practices'].score * 100} | ${baseBuild['best-practices'].score * 100} | ${diff(thisBuild['best-practices'].score * 100, baseBuild['best-practices'].score * 100)}|
| SEO | ${thisBuild.categories.seo.score * 100} | ${baseBuild.categories.seo.score * 100} | ${diff(thisBuild.categories.seo.score * 100, baseBuild.categories.seo.score * 100)}|
| PWA | ${thisBuild.categories.pwa.score * 100} | ${baseBuild.categories.pwa.score * 100} | ${diff(thisBuild.categories.pwa.score * 100, baseBuild.categories.pwa.score * 100)}|
` : 'Fragments not accesible');
}

main().catch(err => setFailed(err.message))

function getLatestBaseReport() {
  return fetch('https://webstats.vercel.app/api/graphql', {
    method: 'post',
    headers: {
      'x-api-key': process.env.WEBSTATS_API_KEY
    },
    body: JSON.stringify({
      query: `
        query Statistic($id: String!, $git_commit_sha: String) {
          project(id: $id) {
            id
            statistics(
              filter: {typename: LIGHTHOUSE, git_commit_sha: {equals: $git_commit_sha}}
              first: 1
            ) {
              __typename
              ... on LighthouseStatistic {
                raw
              }
            }
            __typename
          }
        }
      `,
      variables: {
        id: process.env.WEBSTATS_PROJECT_ID,
        git_commit_sha: process.env.GITHUB_BASE_COMMIT_SHA,
      }
    })
  })
    .then(res => res.json())
    .then(body => body.data.project.statistics[0].raw)
}

function diff(a, b) {
  return a > b ? `<span style="color:green;">+${a - b}</span>` : `<span style="color:red;">${a - b}</span>`
}
