const noop = (e) => {d3.event.stopPropagation()};

// data loading
const geographyDataLoc = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
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

const filterColorScale = d3.schemeSet2;
const tabNames = ["Skills", "Abilities", "Knowledge", "Workstyles"];
const tabWidth = singleViewWidth / tabNames.length;
const tabHeight = singleViewHeight * 0.1;

// boxplot constants
const singleItemWidth = 100;
const boxScale = 0.9;
const boxplotHeight = singleViewHeight * 0.7;

// pretty random constants...not exactly responsive
// we will need to tweak this to fit the screen
const boxLeftShift = singleViewWidth * (1 - boxScale) / 2;
const boxDownShift = boxplotHeight * (1 - boxScale) / 3;

const boxWidth = 10;
const jitterWidth = boxWidth * 2;
