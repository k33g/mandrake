// Description:
//   <description of the scripts functionality>
//   this is my clever bot
'use strict';

module.exports =  (robot) =>  {

  robot.hear(/hello bob/, (res) => {
    res.send(`hi ${res.message.user.name}`);
  });

  robot.hear(/hi|hey|yo/i, (res) => {
    res.send(`👋 ${res.message.user.name}`);
  });

  // ok bob how are you doing?
  robot.hear(/(?=.*ok)(?=.*bob)(?=.*doing)/i, (res) => {
    res.send(`😀 ${res.message.user.name}`);
  });

};
