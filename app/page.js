'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import { Grid, Card, CardContent, Container, Box, Typography, Modal, Stack, TextField, Button, ThemeProvider, createTheme} from '@mui/material' 
import { collection, getDocs, getDoc, setDoc, doc, query, deleteDoc } from "firebase/firestore";
import theme from './theme'
import CustomCard from "@/components/CustomCard"
import ItemList from "@/components/ItemCard"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [items, setItems] = useState([]);
  

  // Make async so app is not frozen while fetching
  const updateInventory = async () =>{
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()

      })
      
    })
    setInventory(inventoryList)
    // console.log(inventoryList)

  }

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity}= docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity-1})
      }
      await updateInventory()
    }
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity+1})
    } else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }
  // Run the update inventory function whenever something in the dependency array (empty in this case) changes.
  // This will only run when the page loads
  useEffect(()=>{
    updateInventory()
  }, [])

  // Put the models
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return(
    <ThemeProvider theme = {theme}>
       <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default, // Apply background color from the theme
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
       <Container sx={{
          flex: 1, // Allow the container to grow and fill the available space
          padding: 2,
        }}
      >
        <Typography variant = "h1">
       Stockify
        </Typography>

        <Grid container spacing ={3} style ={{marginTop: '20px'}}>
          <Grid item xs = {12} md ={3}>
            <CustomCard sx={{ 
              minHeight: '100vh'}}>
              <CardContent>
                <Box>
                <Typography variant = "h2" >
                  This it the time to see it all
                  </Typography>
                </Box>
    
              </CardContent>
            </CustomCard>
          </Grid>
          <Grid item xs ={12} md={9}>
            <Box sx={{ 
              minHeight: '100vh'}}>
              <Typography variant="h2">
                This should work as well
              </Typography>
              {
                inventory.map((item)=>(
                  <Grid>
                    <ItemList 
                    items={inventory}
                    addItem={addItem}
                    removeItem={removeItem}
                    />
                    
                  </Grid>
                ))
              }
              


            

            </Box>
          </Grid>

        </Grid>
      

    </Container>
    </Box>

    </ThemeProvider>
   
  //  <Box width="100vw" height="100vh" display = "flex" flexDirection="column" justifyContent ="center" alignItems ="center" gap={2}> 
  //   <Modal open ={open} onClose ={handleClose}>
  //     <Box 
  //       position ="absolute" 
  //       top="50%" 
  //       left="50%" 
  //       width={400} 
  //       bgcolor="white" 
  //       border= "2px solid #000"  
  //       boxshadow={24} 
  //       p={4} 
  //       display ="flex" 
  //       flexDirection="column gap={3}"
  //       sx={{transform: "translate(-50%, -50%)" }}
  //       >
  //         <Typography variant ="h6">Add Item </Typography> 
  //         <Stack width="100%" direction ="row" spacing={2}>
  //           <TextField
  //           variant="outlined"
  //           fullWidth
  //           value ={itemName}
  //           onChange = {(e)=> {
  //             setItemName(e.target.value)
  //           }}>

  //           </TextField>
  //           <Button
  //             variant="outlined"
  //             onClick={()=>{
  //               addItem(itemName)
  //               setItemName('')
  //               handleClose()
  //             }}>ADD

  //             </Button>
  //         </Stack>


  //     </Box>

  //   </Modal>
  //   <Button variant = "contained" onClick={()=>{
  //     handleOpen()}}
  //     > Add Item</Button>

  //     <Box border ="1px solid #333">
  //       <Box
  //         width ="800px"
  //         height="100px"
  //         bgcolor="ADD8E6"
  //         // Display needs to be flexed for it to be centered?
  //         display="flex"
  //         alignItems="center"
  //         justifyContent="center">
  //           <Typography variant ="h2" color="#333">
  //             Inventory Items

  //           </Typography>
  //         </Box>
          
  //         <Stack
  //         width ="800px"
  //         height="300px"
  //         spacing={2}
  //         overflow="auto">{
  //           inventory.map(({name, quantity})=>(
  //             <Box key = {name} width ="100%"
  //             minheight="150px"
  //             display="flex"
  //             alignItems="center"
  //             justifyContent="space-between"
  //             bgColor="#f0f0f0"
  //             padding={5}>
  //               <Typography 
  //               variant="h3"
  //               color="#333"
  //               textAlign="center">
  //                 {name.charAt(0).toUpperCase() + name.slice(1)}
  //                 </Typography>
  //                 <Typography 
  //               variant="h3"
  //               color="#333"
  //               textAlign="center">
  //                 {quantity}
  //                 </Typography>
  //                 <Stack direction="row" spacing={2}>
  //                 <Button variant="contained" onClick={()=> {
  //                   addItem(name)
  //                 }}>
  //                   Add Item
  //                   </Button>
  //                 <Button variant="contained" onClick={()=> {
  //                   removeItem(name)
  //                 }}>
  //                   Remove
  //                   </Button>
  //                   </Stack>


  //             </Box>

  //           ))}

  //         </Stack>
  //     </Box>
  // </Box>
  )
}
