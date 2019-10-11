const express = require('express');
const express_graphql = require('express-graphql');
const {buildSchema} = require('graphql');

//GraphQL Schema
const schema = buildSchema(`
      type Query{
        course(id:Int!) : Course
        courses(topic:String) : [Course]
      }
      type Mutation{
        updateCourseTopic(id:Int!,topic:String!) : Course
      }
      type Course{
        id:Int,
        author:String,
        description:String,
        url:String,
        topic:String,
        title:String
      }
`);

const courseData = [
  {
    id:1,
    author:'sheik',
    description:'Wild Force',
    url:'www.wildforce.com',
    topic:'Super Heroes',
    title:'Power Rangers'
  },
  {
    id:2,
    author:'faridh',
    description:'Ninja Storm',
    url:'www.ninjastorm.com',
    topic:'Super Ninja',
    title:'Power Rangers'
  }
]
const getCourse = args => courseData.filter(course => course.id === args.id)[0];

const getCourses = args => {
  if(args.topic) return courseData.filter(course => course.topic === args.topic)
  else return courseData;
} 

const updateCourseTopic = ({id,topic}) =>{
  courseData.forEach(course=>{
     if(course.id === id){
       course.topic = topic
     }
  });
  return courseData.filter(course => course.id === id)[0];
}

//Root resolver
const rootValue = {
    course:getCourse,
    courses:getCourses,
    updateCourseTopic
};

//Create an express server and a graphql endpoint
const app = express();
app.use('/graphql',express_graphql({
  schema,
  rootValue,
  graphiql:true
}))

const {PORT = 3000} = process.env;
app.listen(PORT,()=>console.log(`The Server is running on the port ${PORT}`));

/**
 * 
 query getCoursesForTopic($coursesTopic : String){
  courses(topic:$coursesTopic){
    title
    author
    topic
    description
  }
}

query getSingleCourse($courseID : Int !){
  course(id:$courseID){
    title
    author
    topic
    description
  }
}

query getCoursesWithFragments($courseID1:Int!,$courseID2:Int!){
  course1:course(id:$courseID1){
    ...courseFields
  }
  course2:course(id:$courseID2){
    ...courseFields
  }
}

fragment courseFields on Course{
  title
  author
  description
  topic
}

mutation updateCourseTopic($id:Int !,$topic:String !){
  updateCourseTopic(id:$id,topic:$topic){
    ...courseFields
  }
}
*/
