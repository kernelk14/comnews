// Import needed stuff
import { Octokit, App } from "https://esm.sh/octokit?dts"
import { exists } from "https://deno.land/std/fs/mod.ts"
import username from "https://deno.land/x/username/mod.ts"
// const uname = await exec("whoami")
// console.log(uname)
// Get the auth file
const auth_file = await Deno.readTextFile("./gh_personal_access.txt")
const uname = await username()
const octokit = new Octokit ({
  auth: auth_file
})

// Get login 
const {
  data: {login},
} = await octokit.rest.users.getAuthenticated();
console.log(`Hello, ${login}!`)

await octokit.request('GET /user', {
    headers: {
        'X-Github-Api-version': '2022-11-28'
    }
})
// Getting the list of repo subs
const subfile = `/home/${uname}/.reposub`

try { 
  const parseFile = await Deno.readTextFile(subfile)
  let splitNames = parseFile.split(" ")
  if (splitNames.includes("\n")) {
    // splitNames.replace("\n", " ")
    // plsParse(splitNames)
    splitNames = parseFile.split("\n")
  }
  // console.log(file)
  
  let i = 0
  console.log("Available repo subscriptions: ")
  for (;i < splitNames.length;) {
    console.log(`  [${i+1}] > ${splitNames[i]}`)
    i++
  }
  const input = prompt("> ")
  // console.log(splitNames[input-1])
  const keyword = splitNames[input-1]
  const kw_newline = keyword.replace("\n", "")
  const repos = kw_newline.split("/")
  
  if (repos[1].endsWith("\n")) {
    repos[1] = repos[1].replace("\n", " ")
  }
  // console.log(repos)
  const printrepo = await octokit.request(`GET /repos/{owner}/{repo}/commits`, {
      owner: repos[0],
      repo: repos[1].replace("\n", ""),
      headers: {
          'X-Github-Api-version': '2022-11-28'
      }
  })
  // console.log(printrepo)
  const data = printrepo['data']
  let j = 0
  console.log("Commit Lists:")
  while (j < data.length) {
      const d1 = data[j]['commit']['message']
      const d2 = data[j]['commit']['committer']['name']
      const d3 = data[j]['commit']['committer']['date']
      console.log(`\nDate: ${d3}\nCommitter: ${d2}\nCommit: ${d1}\n------------------------------------------------------`)
      j++
  }
  console.log("\n\n")
  Deno.exit(0)
} catch(error) {
  if (!(error instanceof Deno.errors.NotFound)) {
    console.log("You don't have a `.reposub` file in your home directory. Please create one first.")
    throw error 
  }
}
