// Add some interactivity to the website
console.log("Hello, world!");

const actualDate = new Date();
const followersNumber = document.getElementById("followers-number");
const followingNumber = document.getElementById("following-number");
const profileLocation = document.getElementById("profileLocation");
const profileName = document.getElementById("profile-name");
const profileDescription = document.getElementById("profile-description");
const inputUsername = document.getElementById("inputUsername");
const selectUsername = document.getElementById("dropdown-menu");
//handleEvent change on Input to get the username

selectUsername.addEventListener("click", getDataFromGitHub);
inputUsername.addEventListener("change", dropdownMenu);

async function dropdownMenu() {
  const inputName = document.getElementById("inputUsername").value;
  await fetch(`https://api.github.com/users/${inputName}`)
    .then((response) => response.json())
    .then((data) => {
      const { login, name, bio, avatar_url } = data;
      const dropdownName = document.getElementById("dropdown-name");
      const dropdownDescription = document.getElementById("dropdown-des");
      if (avatar_url) {
        document.getElementById("dropdown-img").setAttribute("src", avatar_url);
      }
      dropdownName.textContent = name ? name : login;
      dropdownDescription.textContent = bio ? bio : "Any description set";
      selectUsername.style.visibility = "visible";
    })
    .catch(
      () =>
        (document.getElementById("dropdown-menu").innerHTML = "User Not Found")
    );
}

//asyncronuos function to get fetch data
async function getDataFromGitHub() {
  const inputName = document.getElementById("inputUsername").value;
  document.getElementById("inputUsername").value = "";
  //Hidden de dropdown menu
  selectUsername.style.visibility = "hidden";

  // Fecthing Data from GitHub API by the username given from the client
  await fetch(`https://api.github.com/users/${inputName}`)
    .then((response) => response.json())
    .then((data) => {
      //SETTING "ALL-REPOSITORIES" LINK
      document
        .getElementById("all-repositories")
        .setAttribute(
          "href",
          `https://github.com/${inputName}?tab=repositories`
        );
      //Destructuring data in variables to not repeat myself after
      const {
        login,
        followers,
        following,
        name,
        bio,
        location,
        avatar_url,
        repos_url,
      } = data;

      //Setting the profile
      if (avatar_url) {
        document
          .getElementById("photo-profile-img")
          .setAttribute("src", avatar_url);
      }

      followersNumber.textContent = followers;
      followingNumber.textContent = following;

      profileName.textContent = name ? name : login;

      profileDescription.textContent = bio
        ? bio
        : location
        ? location
        : "Any description set";
      profileLocation.textContent = location ? location : "Not Found";

      //Now Lets make a fetching data to get the repos of this user
      fetch(repos_url)
        .then((response) => response.json())
        .then((data) => {
          //
          //Mapping data Array to get first 4 repositories and their informations
          data.map((obj, index) => {
            /*          
            When the index is 4, 
            stop mapping because we need only 4 results
             */
            if (index === 4) return;
            //-------------------------------------
            index = index + 1;
            //Destructuring the object properties in variables to not repeat myself after
            const {
              name,
              description,
              stargazers_count,
              updated_at,
              forks_count,
              license,
            } = obj;

            const repoName = document.getElementById(`repo-name${index}`);
            const repoDescription = document.getElementById(
              `repo-description${index}`
            );
            const licenseName = document.getElementById(`MIT-label${index}`);
            const nesting = document.getElementById(`Nesting-label${index}`);
            const stars = document.getElementById(`Star-label${index}`);
            const lastUpdate = document.getElementById(`last-label${index}`);
            //------------------------------------------------------------
            //Select repo-name + index TextContent modified
            repoName.textContent = name.replaceAll("-", " ");
            //------------------------------------------------------------
            //Select repo-repository + index TextContent modified
            repoDescription.textContent = description
              ? description
              : "There is any description for this repository";
            //------------------------------------------------------------
            //Select stars forks license
            licenseName.innerHTML = license
              ? `<img src="SVG/Chield_alt.svg" alt="" /> ${license.spdx_id}`
              : "";
            stars.innerHTML = `<img src="SVG/Star.svg" alt="" /> ${stargazers_count}`;
            nesting.innerHTML = `<img src="SVG/Nesting.svg" alt="" /> ${forks_count}`;

            //------------------------------------------------------------
            //Update LastUpdateData Specific Data format ISO 8601
            const lastUpdateData = new Date(updated_at);
            const differenceInMilliseconds = actualDate - lastUpdateData;

            // Calculate how many days passed
            const differenceInDays =
              differenceInMilliseconds / (1000 * 60 * 60 * 24);

            lastUpdate.textContent = `Updated ${Math.floor(
              differenceInDays
            )} days ago`;
            //------------------------------------------------------------
          });
        })
        .catch(console.log("error fecthing repos"));
    })
    .catch(console.log("user not found"));
}
