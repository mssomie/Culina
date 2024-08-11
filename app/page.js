'use client'
import {useState, useEffect} from 'react'
import {firestore, storage} from '@/firebase'
import { Grid, Select, MenuItem, Card, Divider, CardContent, Container, Box, Typography, Modal, Stack, TextField, Button, Input, ThemeProvider, createTheme, InputBase, IconButton, InputAdornment, Paper, FormGroup} from '@mui/material' 
import { collection, getDocs, getDoc, setDoc, doc, query, deleteDoc, addDoc} from "firebase/firestore";
import theme from './theme'
import CustomCard from "@/components/CustomCard"
import ItemList from "@/components/ItemCard"
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CustomTextField from '@/components/CustomTextField';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import React from 'react';
import ReactMarkdown from'react-markdown';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CustomSelect from '@/components/CustomSelect';


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState('')
  const [open, setOpen] = useState(false)
  const [ingredients, setIngredients] = useState([]);
  const [itemName, setItemName] = useState('')
  const [items, setItems] = useState([]);
  const auth = getAuth();


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
    // TODO set ingredients list to only select elements where category is food
    setIngredients(inventoryList);
    // generateRecipe(inventoryList); 

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
        await setDoc(docRef, {quantity: quantity-1}, {merge: true})
      }
      await updateInventory()
    }
  }

  const handleCameraInput = () => {
    // Logic to handle camera input can be implemented here
    // For now, we'll just log a message
    console.log('Camera input clicked');
  };


  const addItem = async (item) =>{
    const docRef = doc(firestore, 'inventory', item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
      const {quantity} = docSnap.data() || {quantity: 0};
      await setDoc(docRef, {quantity: quantity+1}, {merge: true}

      )
    } else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }
  // Run the update inventory function whenever something in the dependency array (empty in this case) changes.
  // This will only run when the page loads
  useEffect(()=>{
    updateInventory()
  }, 
  [])

  const generateRecipe = async(ingredientsArray) =>{

    try{
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ingredients: ingredientsArray}),
      });

      if (!response.ok){
        const errorData = await response.json();
        console.error('Error: ', errorData.error);
        return;
      }
      const data = await response.json();

      setRecipe(data.recipe);
      
      setLoading(false);
      console.log(data.recipe);

    } catch(error){

      console.error('Error generating recipe: ', error);
    } finally{
      setLoading(false);
    }
    // Send ingredient list to API route
    
  };
  


  // Put the models
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Search function
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) =>{
    setSearchQuery(event.target.value);

  };
  const [formValues, setFormValues] = useState({
    name: '',
    category: '',
    quantity: '',
    image: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      image: event.target.files[0],
    }));
  };

  

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    console.log('Form submitted:', formValues); 

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('logged in')
      } else {
        // No user is signed in, redirect to login or show an error
        console.error('User is not authenticated.');
      }
    });

    try {
      let imageUrl ='';

      if (formValues.image) {
        console.log('Attempting to upload image:', formValues.image.name);
        const storageRef = ref(storage, `images/${formValues.image.name}`);
        const snapshot = await uploadBytes(storageRef, formValues.image);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Image uploaded successfully:', imageUrl);
    }


      const docRef = doc(firestore, 'inventory', formValues.name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()){
        const {quantity} = docSnap.data();
        const newQuantity = quantity + Number(formValues.quantity);
        await setDoc(docRef, {
          name: formValues.name,
          category: formValues.category,
          quantity: newQuantity,
          image: imageUrl || docSnap.data().image,
        
        }, {merge: true})
      }
      
      else{
        await setDoc(docRef, {
          name: formValues.name,
          category: formValues.category,
          quantity: Number(formValues.quantity), 
          image: imageUrl , 
        }//,{merge: true}
      );
        console.log('Document written with ID: ', docRef.id); 
      }
      
      

      // Reset the form values
      setFormValues({
        name: '',
        category: '',
        quantity: '',
        image: null,
      });
    } catch (e) {
      console.error('Error adding document: ', e); 
    }
    handleClose();
    updateInventory();


  };



  const filteredItems = inventory.filter(item => {
    const nameMatches = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Uncomment the next line to include category filtering as well.
    // const categoryMatches = item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    console.log(`Item: ${item.name}, Search Query: ${searchQuery}, Name Matches: ${nameMatches}`);
    
    // Return true if either name or category matches the search query
    return nameMatches; // || categoryMatches; 
  });
  useEffect(() => {
    console.log('Filtered Items:', filteredItems);
    
  }, [filteredItems, searchQuery]);
  
  
  
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
       <Modal open ={open} onClose ={handleClose}>
      <Box 
        component="form" onSubmit={handleSubmit} 
        position ="absolute" 
        top="50%" 
        left="50%" 
        width={700}  
        border= "2px solid #000"  
        boxshadow={24} 
        p={4} 
        gap={2}
        spacing={2}
        sx={{mt: 4, transform: "translate(-50%, -50%)", backgroundColor: theme.palette.background.default}}>
        
       
        <Typography variant="h3" sx={{color: 'white', alignItems: 'center', textAlign:"center", p: 4 }} gutterBottom>
          Add New Item
        </Typography>
        <CustomTextField
          variant="outlined"
          placeholder="Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <CustomSelect
          name="category"
          value={formValues.category}
          onChange={handleChange}
          label="Category" 
          fullWidth
          required
          placeholder="Category"
          variant="outlined"
          sx={
            {
              borderRadius: '16px',
              backgroundColor: '#0f171A',
              

            }
          }
          displayEmpty
          renderValue={(selected) => {
          if (selected.length === 0) {
            return <p>Category</p>;  // Placeholder text
          }
        return selected;
  }}
        >
          
          <MenuItem value="food">Food</MenuItem>
          <MenuItem value="utensils">Utensils</MenuItem>
          <MenuItem value="other">Other</MenuItem>
          {/* Add more MenuItem components as needed */}
        </CustomSelect>
        <CustomTextField
          variant="outlined"
          placeholder="quantity"
          name="quantity"
          type="number"
          value={formValues.quantity}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2, marginTop: '15px'}}
          required
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom sx={{color:'white'}}>
            Upload Image
          </Typography>
          <Input
            type="file"
            inputProps={{ accept: 'image/*' }}
            onChange={handleImageChange}
            fullWidth
            
            endAdornment={
              <InputAdornment position="end">
                <Divider orientation="vertical" flexItem sx={{ mx: 1 , color:'white'}} />
                <IconButton sx={{color: theme.palette.primary.main}} onClick={handleCameraInput}>
                  <CameraAltIcon />
                  <Typography sx={{color: 'white', padding:'8px'}}>
                    Use Camera
                  </Typography>
                </IconButton>
              </InputAdornment>
            }
            sx={{
              backgroundColor: "#0f171A",
              borderRadius: '16px',
              padding: '1px 1px',
              '& input': {
                padding: '0.8rem 0.8rem', // Adjust padding to fit height
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4c5e63',
                  borderRadius: '16px',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: '#02E6A2',
                  borderWidth: '1px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#02E6A2',
                  borderWidth: '1px',
                },
              },
            }}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" onSubmit={handleSubmit} >
        
              
          Submit
        </Button>
      </Box>
          

    </Modal>
       <Container sx={{
          flex: 1, // Allow the container to grow and fill the available space
          padding: 2,
        }}
      >
        <Typography variant = "h1"> Stockify </Typography>

        <Grid container spacing ={3} style ={{marginTop: '20px'}}>
          <Grid item xs = {12} md ={3}>
            <CustomCard sx={{ 
              minHeight: '40vh',
              maxHeight: '100vh',
              overflow: 'scroll'}}>
              <CardContent>
                <Box p={1}>
                  <Typography variant="h2" textAlign={"center"}>
                    Culina👩🏾‍🍳✨
                  </Typography>
                  <Typography variant="body2" textAlign={"center"}>
                   Generate recipes with our talented chef AI
                  </Typography>
                  <Box textAlign={"center"}>
                    <Button sx={{
                        padding: '0.65em 1rem',
                    }}

                    variant = "contained" onClick={()=>{generateRecipe(inventory)}} startIcon ={<SmartToyIcon />}>
                      Generate Recipe
                    </Button>

                  </Box>
               

                  <Typography variant="body2">
                    <ReactMarkdown>{recipe}</ReactMarkdown>

                  </Typography>
                </Box>
    
              </CardContent>
            </CustomCard>
          </Grid>
          <Grid item xs ={12} md={9}>
            <Box sx={{ 
              minHeight: '100vh'}}>
              <Typography variant="h2">
                {/* Everyone has the right to freedom of thought */}
              </Typography>
              <Box width="100%" sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Grid container spacing ={2}>
                  <Grid item xs={9} md={10}> 
                  
                  <TextField
                    variant="outlined"
                    placeholder="Start typing to filter.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                    
                    sx={{backgroundColor: "#0f171A",
                    
                    borderRadius: '16px', 

                    '& .MuiInputBase-input': {
                      padding: '0.8rem 0.8rem', // Adjust padding to fit height
                    },
                   
                    
                    padding: '1px 1px', 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#4c5e63',
                        borderRadius: '16px', 
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: '#02E6A2',
                        borderWidth: '1px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#02E6A2',
                        borderWidth: '1px',
                      },
                    },}}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" spacing={2}>
                          <IconButton onClick={handleSearchChange}>
                            <SearchIcon sx={{ color: theme.palette.primary.main}}/>
                            <Typography variant ="body1" sx={{color: 'white', padding: '8px'}}>
                              Search
                              </Typography>
                          </IconButton>
                        </InputAdornment>
                      ),
                     
                    }}
                  />
          

                  </Grid>
                  <Grid item xs={3} md={2}>
                  <Button sx={{
                       padding: '0.65em 1rem',
                  }}
                  variant = "contained" onClick={()=>{handleOpen()}} startIcon ={<AddIcon />}>
                     New Item
                  </Button>

                  </Grid>
                </Grid>
                
              </Box>
              {               
                  <Grid>
                    <ItemList 
                    items={filteredItems}
                    addItem={addItem}
                    removeItem={removeItem}
                    />               
                  </Grid>
                
              }
              


            

            </Box>
          </Grid>

        </Grid>
      

    </Container>
    </Box>

    </ThemeProvider>
   
  
  )
}
