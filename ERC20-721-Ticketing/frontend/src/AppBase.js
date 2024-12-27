import React, { useState, useEffect } from "react";
import { BrowserProvider, parseEther, Contract, decodeBytes32String, encodeBytes32String } from "ethers";
import { CONTRACT_ADDRESSES, ABIS } from "./config";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artists, setArtists] = useState([]); // Liste des artistes
  const [venues, setVenues] = useState([]); // Liste des venues
  const [concerts, setConcerts] = useState([]); // Liste des concerts
  const [paymentMethod, setPaymentMethod] = useState("ETH"); // "ETH" ou "ERC20"
  const [displayPrice, setDisplayPrice] = useState(""); // Prix affiché en fonction de la devise
  const [concertData, setConcertData] = useState({
    artistId: "",
    venueId: "",
    concertDate: "",
    ticketPrice: "",
  });
  const [venueData, setVenueData] = useState({
    name: "",
    capacity: "",
    commission: "",
  });
  const [concertIdToBuy, setConcertIdToBuy] = useState("");
  const [ethAmount, setEthAmount] = useState(""); // Montant d'ETH à échanger
  const [erc20Balance, setErc20Balance] = useState(""); // Solde ERC20

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const providerInstance = new BrowserProvider(window.ethereum);
          const signerInstance = await providerInstance.getSigner();
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          setProvider(providerInstance);
          setSigner(signerInstance);
          setAccount(accounts[0]);

          // Charger toutes les données en parallèle
          await Promise.all([
            loadArtists(providerInstance),
            loadVenues(providerInstance),
            loadConcerts(providerInstance),
            loadErc20Balance(providerInstance),
          ]);
        } catch (error) {
          console.error("Erreur lors du chargement des données blockchain :", error.message);
        }
      } else {
        alert("Veuillez installer MetaMask pour utiliser cette application.");
      }
    };
    loadBlockchainData();
  }, []);

  const loadArtists = async (providerInstance) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, providerInstance); // Utilisation du provider uniquement
      const artistCount = await ticketingSystem.artistCount();
      const artistsArray = [];
  
      for (let i = 1; i <= artistCount; i++) {
        const artist = await ticketingSystem.artistsRegister(i);
        artistsArray.push({ id: i, name: decodeBytes32String(artist.name) });
      }
      setArtists(artistsArray);
    } catch (error) {
      console.error("Erreur lors du chargement des artistes :", error.message);
    }
  };
  
  const loadVenues = async (providerInstance) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, providerInstance);
      const venueCount = await ticketingSystem.venueCount();
      const venuesArray = [];
  
      for (let i = 1; i <= venueCount; i++) {
        const venue = await ticketingSystem.venuesRegister(i);
        venuesArray.push({ id: i, name: decodeBytes32String(venue.name) });
      }
      setVenues(venuesArray);
    } catch (error) {
      console.error("Erreur lors du chargement des salles :", error.message);
    }
  };
  
  const loadConcerts = async (providerInstance) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, providerInstance);
      const concertCount = await ticketingSystem.concertCount();
      const concertsArray = [];
  
      for (let i = 1; i <= concertCount; i++) {
        const concert = await ticketingSystem.concertsRegister(i);
  
        concertsArray.push({
          id: i,
          artistId: concert.artistId.toString(),
          venueId: concert.venueId.toString(),
          concertDate: new Date(Number(concert.concertDate) * 1000).toLocaleString(),
          ticketPrice: concert.ticketPrice.toString(),
          validatedByArtist: concert.validatedByArtist, // Ajout des statuts de validation
          validatedByVenue: concert.validatedByVenue,   // Ajout des statuts de validation
        });
      }
      setConcerts(concertsArray);
    } catch (error) {
      console.error("Erreur lors du chargement des concerts :", error.message);
    }
  };     

  const createArtist = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
      const artistNameBytes32 = encodeBytes32String(artistName);
      const tx = await ticketingSystem.createArtist(artistNameBytes32, 1);
      await tx.wait();
      alert("Artiste créé avec succès !");
      await loadArtists(provider);
    } catch (error) {
      console.error("Erreur lors de la création de l'artiste :", error.message);
    }
  };

  const createVenue = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
      const venueNameBytes32 = encodeBytes32String(venueData.name);
      const tx = await ticketingSystem.createVenue(
        venueNameBytes32,
        parseInt(venueData.capacity),
        parseInt(venueData.commission)
      );
      await tx.wait();
      alert("Salle créée avec succès !");
      await loadVenues(provider);
    } catch (error) {
      console.error("Erreur lors de la création de la salle :", error.message);
    }
  };

  const createConcert = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
      const tx = await ticketingSystem.createConcert(
        concertData.artistId,
        concertData.venueId,
        Math.floor(new Date(concertData.concertDate).getTime() / 1000),
        parseEther(concertData.ticketPrice)
      );
      await tx.wait();
      alert("Concert créé avec succès !");
      await loadConcerts(provider);
    } catch (error) {
      console.error("Erreur lors de la création du concert :", error.message);
    }
  };

  const validateConcert = async (concertId) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
  
      // Appel de la fonction validateConcert
      const tx = await ticketingSystem.validateConcert(concertId);
      await tx.wait();
  
      alert("Concert validé avec succès !");
      await loadConcerts(provider); // Recharge les concerts pour afficher les mises à jour
    } catch (error) {
      console.error("Erreur lors de la validation du concert :", error.message);
    }
  };  

  const exchangeEthToErc20 = async () => {
    try {
      const exchangeContract = new Contract(CONTRACT_ADDRESSES.ContractExchange, ABIS.ContractExchange, signer);

      // Conversion du montant ETH en Wei
      const ethInWei = parseEther(ethAmount);

      // Effectuer l'échange
      const tx = await exchangeContract.exchangeEthForErc20({ value: ethInWei });
      await tx.wait();

      const erc20Amount = ethAmount * 3400;
      alert(`Échange réussi ! Vous avez reçu ${erc20Amount} ERC20.`);
      await loadErc20Balance(); 
    } catch (error) {
      console.error("Erreur lors de l'échange d'ETH contre ERC20 :", error.message);
    }
  };

  const loadErc20Balance = async () => {
    try {
      const erc20Contract = new Contract(CONTRACT_ADDRESSES.ContractERC20, ABIS.ContractERC20, provider);
      const balance = await erc20Contract.balanceOf(account);
      setErc20Balance(balance.toString() / 1e18); // Conversion en Ether (assume 18 decimals)
    } catch (error) {
      console.error("Erreur lors du chargement du solde ERC20 :", error.message);
    }
  };  

  const approveERC20 = async (amount) => {
    try {
      const erc20Contract = new Contract(CONTRACT_ADDRESSES.ContractERC20, ABIS.ContractERC20, signer);
      const tx = await erc20Contract.approve(CONTRACT_ADDRESSES.ContractExchange, parseEther(amount));
      await tx.wait();
      alert("Approbation réussie !");
    } catch (error) {
      console.error("Erreur lors de l'approbation des tokens :", error.message);
    }
  };  

  const buyTicket = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
  
      // Vérifiez si le concert existe
      const concert = concerts.find((c) => c.id === parseInt(concertIdToBuy));
      if (!concert) {
        alert("Concert non trouvé. Veuillez vérifier l'ID du concert.");
        console.error(`Concert avec l'ID ${concertIdToBuy} introuvable.`);
        return;
      }
  
      console.log("Détails du concert :", concert);
  
      // Conversion correcte de ticketPrice pour ethers (valeur en Wei)
      const ticketPrice = parseEther((parseFloat(concert.ticketPrice) / 1e18).toString());
  
      console.log("Prix du ticket à envoyer :", ticketPrice.toString());
  
      // Envoi de la transaction
      const tx = await ticketingSystem.buyTicket(concertIdToBuy, { value: ticketPrice });
      console.log("Transaction envoyée :", tx);
  
      await tx.wait();
      alert("Ticket acheté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'achat du ticket :", error);
      alert("Une erreur est survenue lors de l'achat du ticket. Consultez la console pour plus d'informations.");
    }
  };

  const buyTicketWithERC20 = async (concertId) => {
    try {
      const exchangeContract = new Contract(CONTRACT_ADDRESSES.ContractExchange, ABIS.ContractExchange, signer);
      const tx = await exchangeContract.buyTicketWithERC20(concertId);
      await tx.wait();
      alert("Ticket acheté avec succès avec des ERC20 !");
    } catch (error) {
      console.error("Erreur lors de l'achat du ticket avec ERC20 :", error.message);
    }
  };  

  useEffect(() => {
    const updateDisplayPrice = async () => {
      try {
        if (concertIdToBuy) {
          const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, provider);
          const concert = await ticketingSystem.concertsRegister(concertIdToBuy);
  
          const ticketPriceInEth = parseFloat(concert.ticketPrice) / 1e18; // Prix en ETH
          const ticketPriceInERC20 = ticketPriceInEth * 3400; // Exemple de taux 1 ETH = 100 ERC20
  
          setDisplayPrice(paymentMethod === "ETH" ? `${ticketPriceInEth} ETH` : `${ticketPriceInERC20} ERC20`);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du prix :", error.message);
      }
    };
  
    updateDisplayPrice();
  }, [paymentMethod, concertIdToBuy]); // Dépend des changements de méthode de paiement ou d'ID  

  return (
    <div className="App">
      <h1>🎟️ Marketplace de Tickets</h1>
      <p>Connecté avec : {account}</p>
      <p>Solde ERC20 : {erc20Balance} MPT</p>

      {/* Section Création Artiste */}
      <div>
        <h2>Créer un Artiste</h2>
        <input type="text" placeholder="Nom de l'artiste" onChange={(e) => setArtistName(e.target.value)} />
        <button onClick={createArtist}>Créer Artiste</button>
      </div>

      {/* Liste des Artistes */}
      <div>
        <h2>Liste des Artistes</h2>
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>
              ID : {artist.id} | Nom : {artist.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Section Création Venue */}
      <div>
        <h2>Créer une Salle</h2>
        <input type="text" placeholder="Nom de la salle" onChange={(e) => setVenueData({ ...venueData, name: e.target.value })} />
        <input type="number" placeholder="Capacité" onChange={(e) => setVenueData({ ...venueData, capacity: e.target.value })} />
        <input type="number" placeholder="Commission (%)" onChange={(e) => setVenueData({ ...venueData, commission: e.target.value })} />
        <button onClick={createVenue}>Créer Salle</button>
      </div>

      {/* Liste des Venues */}
      <div>
        <h2>Liste des Salles</h2>
        <ul>
          {venues.map((venue) => (
            <li key={venue.id}>
              ID : {venue.id} | Nom : {venue.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Section Création Concert */}
      <div>
        <h2>Créer un Concert</h2>
        <input type="text" placeholder="ID de l'artiste" onChange={(e) => setConcertData({ ...concertData, artistId: e.target.value })} />
        <input type="text" placeholder="ID de la salle (venue)" onChange={(e) => setConcertData({ ...concertData, venueId: e.target.value })} />
        <input type="datetime-local" onChange={(e) => setConcertData({ ...concertData, concertDate: e.target.value })} />
        <input type="text" placeholder="Prix du ticket (ETH)" onChange={(e) => setConcertData({ ...concertData, ticketPrice: e.target.value })} />
        <button onClick={createConcert}>Créer Concert</button>
      </div>

      {/* Liste des Concerts */}
      <div>
      <h2>Liste des Concerts</h2>
        <ul>
          {concerts.map((concert) => {
            const ticketPriceInEth = concert.ticketPrice / 1e18;
            const ticketPriceInErc20 = ticketPriceInEth * 3400;
            return (
              <li key={concert.id}>
                ID : {concert.id} | Artiste ID : {concert.artistId} | Salle ID : {concert.venueId} |
                Date : {concert.concertDate} | Prix : {ticketPriceInEth} ETH / {ticketPriceInErc20} ERC20 |
                Statut : {concert.validatedByArtist && concert.validatedByVenue ? "✅ Validé" : "❌ Non validé"}
                <button onClick={() => validateConcert(concert.id)}>Valider Concert</button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Section Achat de Ticket */}
      <div>
        <h2>Échange d'ETH contre des ERC20</h2>
        <input
          type="number"
          placeholder="Montant d'ETH"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
        />
        <button onClick={exchangeEthToErc20}>Échanger</button>
        <h2>Acheter un Ticket</h2>
        <input
          type="text"
          placeholder="ID du concert"
          onChange={(e) => setConcertIdToBuy(e.target.value)}
        />
        <div>
          <label>Méthode de paiement :</label>
          <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
            <option value="ETH">ETH</option>
            <option value="ERC20">ERC20</option>
          </select>
        </div>
        <p>Prix du ticket : {displayPrice}</p>
        {paymentMethod === "ETH" ? (
          <button onClick={buyTicket}>Acheter avec ETH</button>
        ) : (
          <>
            <button onClick={() => approveERC20("100")}>Approuver ERC20</button>
            <button onClick={() => buyTicketWithERC20(concertIdToBuy)}>Acheter avec ERC20</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

##########
##########

import React, { useState, useEffect } from "react";
import {
  BrowserProvider,
  parseEther,
  Contract,
  decodeBytes32String,
  encodeBytes32String,
} from "ethers";
import { CONTRACT_ADDRESSES, ABIS } from "./config";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import "./App.css";
import HomePage from "./pages/HomePage";
import ArtistsPage from "./pages/ArtistsPage";
import VenuesPage from "./pages/VenuesPage";
import ConcertsPage from "./pages/ConcertsPage";
import TicketsPage from "./pages/TicketsPage";
import ExchangePage from "./pages/ExchangePage";
import NotFoundPage from "./pages/NotFoundPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./styles/App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artists, setArtists] = useState([]); // Liste des artistes
  const [venues, setVenues] = useState([]); // Liste des venues
  const [concerts, setConcerts] = useState([]); // Liste des concerts
  const [paymentMethod, setPaymentMethod] = useState("ETH"); // "ETH" ou "ERC20"
  const [displayPrice, setDisplayPrice] = useState(""); // Prix affiché en fonction de la devise
  const [concertData, setConcertData] = useState({
    artistId: "",
    venueId: "",
    concertDate: "",
    ticketPrice: "",
  });
  const [venueData, setVenueData] = useState({
    name: "",
    capacity: "",
    commission: "",
  });
  const [concertIdToBuy, setConcertIdToBuy] = useState("");
  const [ethAmount, setEthAmount] = useState(""); // Montant d'ETH à échanger
  const [erc20Balance, setErc20Balance] = useState(""); // Solde ERC20
  const [artistError, setArtistError] = useState("");
  const [venueError, setVenueError] = useState("");
  const [concertError, setConcertError] = useState("");
  const [validateConcertError, setValidateConcertError] = useState("");
  const [exchangeError, setExchangeError] = useState("");
  const [buyError, setBuyError] = useState("");
  const [buyERC20Error, setBuyERC20Error] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const providerInstance = new BrowserProvider(window.ethereum);
          const signerInstance = await providerInstance.getSigner();
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          setProvider(providerInstance);
          setSigner(signerInstance);
          setAccount(accounts[0]);

          // Charger toutes les données en parallèle
          await Promise.all([
            loadArtists(providerInstance),
            loadVenues(providerInstance),
            loadConcerts(providerInstance),
            loadErc20Balance(providerInstance),
          ]);
        } catch (error) {
          console.error("Erreur lors du chargement des données blockchain :", error.message);
        }
      } else {
        alert("Veuillez installer MetaMask pour utiliser cette application.");
      }
    };
    loadBlockchainData();
  }, []);

  const loadArtists = async (providerInstance) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, providerInstance); // Utilisation du provider uniquement
      const artistCount = await ticketingSystem.artistCount();
      const artistsArray = [];
  
      for (let i = 1; i <= artistCount; i++) {
        const artist = await ticketingSystem.artistsRegister(i);
        artistsArray.push({ id: i, name: decodeBytes32String(artist.name) });
      }
      setArtists(artistsArray);
    } catch (error) {
      console.error("Erreur lors du chargement des artistes :", error.message);
    }
  };
  
  const loadVenues = async (providerInstance) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, providerInstance);
      const venueCount = await ticketingSystem.venueCount();
      const venuesArray = [];
  
      for (let i = 1; i <= venueCount; i++) {
        const venue = await ticketingSystem.venuesRegister(i);
        venuesArray.push({ id: i, name: decodeBytes32String(venue.name) });
      }
      setVenues(venuesArray);
    } catch (error) {
      console.error("Erreur lors du chargement des salles :", error.message);
    }
  };
  
  const loadConcerts = async (providerInstance) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, providerInstance);
      const concertCount = await ticketingSystem.concertCount();
      const concertsArray = [];
  
      for (let i = 1; i <= concertCount; i++) {
        const concert = await ticketingSystem.concertsRegister(i);
  
        concertsArray.push({
          id: i,
          artistId: concert.artistId.toString(),
          venueId: concert.venueId.toString(),
          concertDate: new Date(Number(concert.concertDate) * 1000).toLocaleString(),
          ticketPrice: concert.ticketPrice.toString(),
          validatedByArtist: concert.validatedByArtist, // Ajout des statuts de validation
          validatedByVenue: concert.validatedByVenue,   // Ajout des statuts de validation
        });
      }
      setConcerts(concertsArray);
    } catch (error) {
      console.error("Erreur lors du chargement des concerts :", error.message);
    }
  };     

  const createArtist = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
      const artistNameBytes32 = encodeBytes32String(artistName);
      const tx = await ticketingSystem.createArtist(artistNameBytes32, 1);
      await tx.wait();
      alert("Artiste créé avec succès !");
      await loadArtists(provider);
  
      // Réinitialisation du champ
      setArtistName("");
    } catch (error) {
      console.error("Erreur lors de la création de l'artiste :", error.message);
      setArtistError(error.message);
    }
  };  

  const createVenue = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
      const venueNameBytes32 = encodeBytes32String(venueData.name);
      const tx = await ticketingSystem.createVenue(
        venueNameBytes32,
        parseInt(venueData.capacity),
        parseInt(venueData.commission)
      );
      await tx.wait();
      alert("Salle créée avec succès !");
      await loadVenues(provider);
  
      // Réinitialisation des champs
      setVenueData({ name: "", capacity: "", commission: "" });
    } catch (error) {
      console.error("Erreur lors de la création de la salle :", error.message);
      setVenueError(error.message);
    }
  };  

  const createConcert = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
      const tx = await ticketingSystem.createConcert(
        concertData.artistId,
        concertData.venueId,
        Math.floor(new Date(concertData.concertDate).getTime() / 1000),
        parseEther(concertData.ticketPrice)
      );
      await tx.wait();
      alert("Concert créé avec succès !");
      await loadConcerts(provider);
  
      // Réinitialisation des champs
      setConcertData({ artistId: "", venueId: "", concertDate: "", ticketPrice: "" });
    } catch (error) {
      console.error("Erreur lors de la création du concert :", error.message);
      setConcertError(error.message);
    }
  };  

  const validateConcert = async (concertId) => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
  
      // Appel de la fonction validateConcert
      const tx = await ticketingSystem.validateConcert(concertId);
      await tx.wait();
  
      alert("Concert validé avec succès !");
      await loadConcerts(provider); // Recharge les concerts pour afficher les mises à jour
    } catch (error) {
      console.error("Erreur lors de la validation du concert :", error.message);
      setValidateConcertError(error.message);
    }
  };  

  const exchangeEthToErc20 = async () => {
    try {
      const exchangeContract = new Contract(CONTRACT_ADDRESSES.ContractExchange, ABIS.ContractExchange, signer);

      // Conversion du montant ETH en Wei
      const ethInWei = parseEther(ethAmount);

      // Effectuer l'échange
      const tx = await exchangeContract.exchangeEthForErc20({ value: ethInWei });
      await tx.wait();

      const erc20Amount = ethAmount * 3400;
      alert(`Échange réussi ! Vous avez reçu ${erc20Amount} ERC20.`);
      await loadErc20Balance(); 
    } catch (error) {
      console.error("Erreur lors de l'échange d'ETH contre ERC20 :", error.message);
      setExchangeError(error.message);
    }
  };

  const loadErc20Balance = async () => {
    try {
      const erc20Contract = new Contract(CONTRACT_ADDRESSES.ContractERC20, ABIS.ContractERC20, provider);
      const balance = await erc20Contract.balanceOf(account);
      setErc20Balance(balance.toString() / 1e18); // Conversion en Ether (assume 18 decimals)
    } catch (error) {
      console.error("Erreur lors du chargement du solde ERC20 :", error.message);
    }
  };  

  const approveERC20 = async (amount) => {
    try {
      const erc20Contract = new Contract(CONTRACT_ADDRESSES.ContractERC20, ABIS.ContractERC20, signer);
      const tx = await erc20Contract.approve(CONTRACT_ADDRESSES.ContractExchange, parseEther(amount));
      await tx.wait();
      alert("Approbation réussie !");
    } catch (error) {
      console.error("Erreur lors de l'approbation des tokens :", error.message);
    }
  };  

  const buyTicket = async () => {
    try {
      const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, signer);
  
      // Vérifiez si le concert existe
      const concert = concerts.find((c) => c.id === parseInt(concertIdToBuy));
      if (!concert) {
        alert("Concert non trouvé. Veuillez vérifier l'ID du concert.");
        console.error(`Concert avec l'ID ${concertIdToBuy} introuvable.`);
        return;
      }
  
      console.log("Détails du concert :", concert);
  
      // Conversion correcte de ticketPrice pour ethers (valeur en Wei)
      const ticketPrice = parseEther((parseFloat(concert.ticketPrice) / 1e18).toString());
  
      console.log("Prix du ticket à envoyer :", ticketPrice.toString());
  
      // Envoi de la transaction
      const tx = await ticketingSystem.buyTicket(concertIdToBuy, { value: ticketPrice });
      console.log("Transaction envoyée :", tx);
  
      await tx.wait();
      alert("Ticket acheté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'achat du ticket :", error.message);
      setBuyError(error.message);
    }
  };

  const buyTicketWithERC20 = async (concertId) => {
    try {
      // Vérifiez si le concert existe
      const concert = concerts.find((c) => c.id === parseInt(concertId));
      if (!concert) {
        throw new Error("Concert non trouvé. Veuillez vérifier l'ID du concert.");
      }
  
      // Vérifiez si le concert est validé
      if (!concert.validatedByArtist || !concert.validatedByVenue) {
        throw new Error("Le concert doit être validé avant l'achat.");
      }
  
      // Si tout est valide, procédez à l'achat
      const exchangeContract = new Contract(CONTRACT_ADDRESSES.ContractExchange, ABIS.ContractExchange, signer);
      const tx = await exchangeContract.buyTicketWithERC20(concertId);
      await tx.wait();
      alert("Ticket acheté avec succès avec des ERC20 !");
      setBuyERC20Error(""); // Réinitialisation de l'erreur en cas de succès
    } catch (error) {
      console.error("Erreur lors de l'achat du ticket avec ERC20 :", error.message);
      setBuyERC20Error(error.message); // Mise à jour du message d'erreur
    }
  };   

  useEffect(() => {
    const updateDisplayPrice = async () => {
      try {
        if (concertIdToBuy) {
          const ticketingSystem = new Contract(CONTRACT_ADDRESSES.TicketingSystem, ABIS.TicketingSystem, provider);
          const concert = await ticketingSystem.concertsRegister(concertIdToBuy);
  
          const ticketPriceInEth = parseFloat(concert.ticketPrice) / 1e18; // Prix en ETH
          const ticketPriceInERC20 = ticketPriceInEth * 3400; // Exemple de taux 1 ETH = 100 ERC20
  
          setDisplayPrice(paymentMethod === "ETH" ? `${ticketPriceInEth} ETH` : `${ticketPriceInERC20} ERC20`);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du prix :", error.message);
      }
    };
  
    updateDisplayPrice();
  }, [paymentMethod, concertIdToBuy]); // Dépend des changements de méthode de paiement ou d'ID  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {/* Header */}
        <Box textAlign="center" mt={5}>
          <Typography variant="h3" gutterBottom>
            🎟️ Marketplace de Tickets
          </Typography>
          <Typography variant="h6" gutterBottom>
            Connecté avec : {account || "Non connecté"}
          </Typography>
          <Typography variant="subtitle1">Solde ERC20 : {erc20Balance} MPT</Typography>
        </Box>

        {/* Section Création Artiste */}
        <Box mt={5}>
          <Typography variant="h5">Créer un Artiste</Typography>
          <TextField
            label="Nom de l'artiste"
            variant="outlined"
            fullWidth
            margin="normal"
            value={artistName} // Synchronisation avec l'état
            onChange={(e) => setArtistName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createArtist} // Appelle votre fonction existante
          >
            Créer Artiste
          </Button>
          {artistError && (
            <Typography color="error" mt={2}>
              Erreur : {artistError}
            </Typography>
          )}
        </Box>

        {/* Liste des Artistes */}
        <Box mt={5}>
          <Typography variant="h5">Liste des Artistes</Typography>
          <ul>
            {artists.map((artist) => (
              <li key={artist.id}>
                ID : {artist.id} | Nom : {artist.name}
              </li>
            ))}
          </ul>
        </Box>

        {/* Section Création Venue */}
        <Box mt={5}>
          <Typography variant="h5">Créer une Salle</Typography>
          <TextField
            label="Nom de la salle"
            variant="outlined"
            fullWidth
            margin="normal"
            value={venueData.name} // Synchronisation avec l'état
            onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
          />
          <TextField
            label="Capacité"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={venueData.capacity} // Synchronisation avec l'état
            onChange={(e) => setVenueData({ ...venueData, capacity: e.target.value })}
          />
          <TextField
            label="Commission (%)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={venueData.commission} // Synchronisation avec l'état
            onChange={(e) => setVenueData({ ...venueData, commission: e.target.value })}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={createVenue}
          >
            Créer Salle
          </Button>
          {venueError && (
            <Typography color="error" mt={2}>
              Erreur : {venueError}
            </Typography>
          )}
        </Box>

        {/* Liste des Salles */}
        <Box mt={5}>
          <Typography variant="h5">Liste des Salles</Typography>
          <ul>
            {venues.map((venue) => (
              <li key={venue.id}>
                ID : {venue.id} | Nom : {venue.name}
              </li>
            ))}
          </ul>
        </Box>

        {/* Section Création Concert */}
        <Box mt={5}>
          <Typography variant="h5">Créer un Concert</Typography>
          <TextField
            label="ID de l'artiste"
            variant="outlined"
            fullWidth
            margin="normal"
            value={concertData.artistId} // Synchronisation avec l'état
            onChange={(e) => setConcertData({ ...concertData, artistId: e.target.value })}
          />
          <TextField
            label="ID de la salle"
            variant="outlined"
            fullWidth
            margin="normal"
            value={concertData.venueId} // Synchronisation avec l'état
            onChange={(e) => setConcertData({ ...concertData, venueId: e.target.value })}
          />
          <TextField
            label="Date du concert"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }} // Empêche le label de se superposer
            value={concertData.concertDate}
            onChange={(e) => setConcertData({ ...concertData, concertDate: e.target.value })}
          />
          <TextField
            label="Prix du ticket (ETH)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={concertData.ticketPrice} // Synchronisation avec l'état
            onChange={(e) => setConcertData({ ...concertData, ticketPrice: e.target.value })}
          />
          <Button
            variant="contained"
            color="success"
            onClick={createConcert}
          >
            Créer Concert
          </Button>
          {concertError && (
            <Typography color="error" mt={2}>
              Erreur : {concertError}
            </Typography>
          )}
        </Box>

        {/* Liste des Concerts */}
        <Box mt={5}>
          <Typography variant="h5">Liste des Concerts</Typography>
          <ul>
            {concerts.map((concert) => {
              const ticketPriceInEth = concert.ticketPrice / 1e18;
              const ticketPriceInErc20 = ticketPriceInEth * 3400;
              return (
                <li key={concert.id}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    bgcolor="background.paper"
                    p={2}
                    mb={2}
                    borderRadius={2}
                    boxShadow={2}
                  >
                    <Typography variant="body1">
                      <strong>ID :</strong> {concert.id} | <strong>Artiste ID :</strong> {concert.artistId} |{" "}
                      <strong>Salle ID :</strong> {concert.venueId}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Date :</strong> {concert.concertDate} | <strong>Prix :</strong> {ticketPriceInEth} ETH /{" "}
                      {ticketPriceInErc20} ERC20
                    </Typography>
                    <Typography variant="body1">
                      <strong>Statut :</strong>{" "}
                      {concert.validatedByArtist && concert.validatedByVenue ? (
                        <Typography variant="body2" color="success.main">
                          ✅ Validé
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="error.main">
                          ❌ Non validé
                        </Typography>
                      )}
                    </Typography>
                    {!concert.validatedByArtist || !concert.validatedByVenue ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => validateConcert(concert.id)}
                        sx={{ mt: 1 }}
                      >
                        Valider Concert
                      </Button>
                    ) : null}
                    {validateConcertError && (
                      <Typography color="error" mt={2}>
                        Erreur : {validateConcertError}
                      </Typography>
                    )}
                  </Box>
                </li>
              );
            })}
          </ul>
        </Box>

        {/* Section Achat Ticket et Échange ETH/ERC20 */}
        <Box mt={5}>
          <Typography variant="h5">Échange d'ETH contre des ERC20</Typography>
          <TextField
            label="Montant d'ETH"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={ethAmount} // Synchronisation avec l'état
            onChange={(e) => setEthAmount(e.target.value)}
          />
          <Button
            variant="contained"
            color="warning"
            onClick={exchangeEthToErc20}
          >
            Échanger
          </Button>
          {exchangeError && (
            <Typography color="error" mt={2}>
              Erreur : {exchangeError}
            </Typography>
          )}
        </Box>

        <Box mt={5}>
          <Typography variant="h5">Acheter un Ticket</Typography>
          <TextField
            label="ID du concert"
            variant="outlined"
            fullWidth
            margin="normal"
            value={concertIdToBuy} // Synchronisation avec l'état
            onChange={(e) => setConcertIdToBuy(e.target.value)}
          />
          <Box mt={2}>
            <Typography variant="body1">Méthode de paiement :</Typography>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="ERC20">ERC20</MenuItem>
            </Select>
          </Box>
          <Typography variant="body1">Prix du ticket : {displayPrice}</Typography>
          {paymentMethod === "ETH" ? (
            <>
              <Button variant="contained" color="primary" onClick={buyTicket}>
                Acheter avec ETH
              </Button>
              {buyError && (
                <Typography color="error" mt={2}>
                  Erreur : {buyError}
                </Typography>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => approveERC20("100")}
              >
                Approuver ERC20
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => buyTicketWithERC20(concertIdToBuy)}
              >
                Acheter avec ERC20
              </Button>
              {buyERC20Error && (
                <Typography color="error" mt={2}>
                  Erreur : {buyERC20Error}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;