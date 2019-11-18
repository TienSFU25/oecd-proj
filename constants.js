const noop = (e) => {d3.event.stopPropagation()};

// data loading
const geographyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const worldTopologyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv";
const irisDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv";
const skillsDataLoc = "https://raw.githubusercontent.com/cusoh/data_skills/master/SKILLS_2018_TOTAL_25102019044734209.csv";

// layout
const margin = {top: 30, right: 0, bottom: 0, left: 10},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

const actualWidth = width - margin.left - margin.right;
const actualHeight = height - margin.top - margin.bottom;
const widthOffset = 15;

const singleViewWidth = actualWidth / 2 - widthOffset;
const singleViewHeight = actualHeight / 2 - widthOffset;

// map constants
const unknownCountryCode = -10;
const zoom = 1.1;
const unknownColorFill = "#ffffff";
const hoverTransitionTimeMs = 200;

// from individual to composite key (and back)
const keyInvFn = (d) => {
    const temp = d.split('/');
    return {
        Category: temp[0],
        SkillName: temp[1]
    };
};
const combineFn = (Category, SkillName) => `${Category}/${SkillName}`;
