const db = require("../model/databaseTable");
const cron = require('node-cron');

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const expiryChecker = () => {
  db.query(`SELECT * FROM inventory `, (err, results) => {
    if (err) {
      console.error("Error fetching inventory data:", err.sqlMessage);
      return;
    }

    let inventoryData = JSON.parse(JSON.stringify(results));

    inventoryData.forEach((inventory) => {
      inventory.created_date = formatDate(inventory.created_date);
      inventory.Manufacture_date = formatDate(inventory.Manufacture_date);
      inventory.Expire_date = formatDate(inventory.Expire_date);
    });

    const itemsWithDaysLeft = inventoryData.map((item) => {
      const today = new Date();
      const correctedExpireDate = new Date(formatDate(item.Expire_date));
      const timeDifference = correctedExpireDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

      return { id: item.id, days_left: daysLeft };
    });

    const allInventory = inventoryData.map((item) => {
      const correspondingWatchData = itemsWithDaysLeft.find(watchItem => watchItem.id === item.id);
      return { ...item, watchData: correspondingWatchData };
    });

    allInventory.forEach(data => {
      if (data.watchData.days_left <= 0) {
        const itemId = data.id;

        const inventoryQuery = `UPDATE inventory SET expired = 'expired' WHERE id = ?`;
        const productQuery = `UPDATE Products SET ? WHERE inventory_id = "${itemId}"`;
        
      
            // update inventory
            db.query(inventoryQuery, [itemId], (err, result) => {
              if (err) {
                console.error(`Error updating inventory with ID ${itemId}:`, err.sqlMessage);
              } else {
                console.log(`Inventory with ID ${itemId} has been updated to expired.`);
              }
            });

        // first check if it's in the product shelf
        db.query(`SELECT * FROM Products WHERE inventory_id = "${itemId}"`,(err,results)=>{
          if (err) {
            console.error(`Error updating product with ID ${itemId}:`, err.sqlMessage);
          } else {

            if (results.length <=0) {
              return console.log(`the community is safe! inventory with id ${itemId} was not added to the shelf...`);
            }

                 
        let data = {
          status : 'expired' 
        }

            db.query(productQuery, data, (err, result) => {
              if (err) {
                console.error(`Error updating product with ID ${itemId}:`, err.sqlMessage);
              } else {
                console.log(`Product with invntory_ID ${itemId} has been updated to expired.`);
              }
            });
          }
        })

     

    
      }
    });
  });
};

const userRankingChecker = () => {
  let ranks = ['Newbie', 'Bossman', 'Chairman'];

  db.query(`SELECT * FROM Users`, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err.sqlMessage);
      return;
    }

    let userData = JSON.parse(JSON.stringify(results));

    userData.forEach(user => {
      let newRank;

      if (user.spending <= 10000) {
        newRank = ranks[0]; // rank a
      } else if (user.spending > 10000 && user.spending <= 20000) {
        newRank = ranks[1]; // rank b
      } else if (user.spending > 20000) {
        newRank = ranks[2]; // rank c
      }

      // Update user rank if a new rank is determined
      if (newRank) {
        db.query(`UPDATE Users SET rank = ? WHERE id = ?`, [newRank, user.id], (err, result) => {
          if (err) {
            console.error(`Error updating user ID ${user.id}:`, err.sqlMessage);
          } else {
            console.log(`User ID ${user.id} rank updated to ${newRank}`);
          }
        });
      }
    });
    
  });
};

// Schedule the job to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running minute update job...');
    expiryChecker();
    userRankingChecker();
});

module.exports = expiryChecker;
