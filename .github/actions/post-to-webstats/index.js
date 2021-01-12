const { setOutput, setFailed } = require('@actions/core')
const fetch = require('node-fetch')

const _ = require('@lhci/utils/src/lodash.js')
const { computeRepresentativeRuns } = require('@lhci/utils/src/representative-runs.js')
const { loadSavedLHRs } = require('@lhci/utils/src/saved-reports.js')

async function main() {
  const lighthouseReport = getRepresentativeBuild()

  await fetch('https://webstats.vercel.app/api/graphql', {
    method: 'post',
    headers: {
      'x-api-key': process.env.WEBSTATS_API_KEY
    },
    body: JSON.stringify({
      query: `
        mutation($lighthouseReport: JSONObject!) {
          createLighthouseStatistic (
            project_id: "${process.env.WEBSTATS_PROJECT_ID}",
            git_commit_sha: "${process.env.GITHUB_SHA}",
            data: $lighthouseReport
          ) {
            speed_index
          }
        }
      `,
      variables: {
        lighthouseReport
      }
    })
  })

  setOutput('report', lighthouseReport.categories)
}

main().catch(err => setFailed(err.message))

function getRepresentativeBuild() {
  const lhrs = loadSavedLHRs().map(lhr => JSON.parse(lhr))
  const lhrsByUrl = _.groupBy(lhrs, lhr => lhr.finalUrl).map(lhrs => lhrs.map(lhr => [lhr, lhr]))
  const representativeLhrs = computeRepresentativeRuns(lhrsByUrl)
  return representativeLhrs[0]
}
