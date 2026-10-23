// Extraits de code d'IntelliRoom affichés dans la fenêtre « Sous le capot ».
// Ce sont de vrais extraits (raccourcis avec « ... »). Pas de clés, de mots de passe ni d'adresses de serveur.
// Pour modifier un extrait : change `code`. Pour ajouter un onglet : copie un bloc.

export const codeUi = {
  fr: {
    button: 'Voir des extraits de code',
    title: 'Sous le capot',
    intro: 'Trois morceaux d’IntelliRoom, tirés du vrai code (raccourcis pour la lecture).',
    close: 'Fermer',
  },
  en: {
    button: 'Peek at the code',
    title: 'Under the hood',
    intro: 'Three pieces of IntelliRoom, taken from the real code (shortened for reading).',
    close: 'Close',
  },
}

export const codeTabs = [
  {
    id: 'conflicts',
    lang: 'php',
    file: 'BookingController.php',
    fr: {
      tab: 'Conflits de réservation',
      text: 'Plusieurs demandes peuvent viser le même créneau : ce ne sont que des intentions. Le vrai contrôle se fait à la validation, contre les réservations déjà validées. Dans une transaction, la salle est attribuée et les demandes concurrentes sont annulées avec un message poli au client.',
    },
    en: {
      tab: 'Booking conflicts',
      text: 'Several requests can target the same slot: they are only intentions. The real check happens at validation, against bookings that are already approved. In one transaction, the room is assigned and competing requests are cancelled with a polite message to the client.',
    },
    code: `public function validateBooking($id)
{
    $reservation = Reservation::find($id);
    // ...

    // Le vrai contrôle de conflit : uniquement contre des engagements
    // déjà réels (validee / confirmee)
    $dejaPrise = Reservation::where('id_salle', $reservation->id_salle)
        ->where('id_reservation', '!=', $reservation->id_reservation)
        ->whereIn('statut', ['validee', 'confirmee'])
        ->where(function ($q) use ($reservation) {
            $q->whereBetween('date_debut', [$reservation->date_debut, $reservation->date_fin])
                ->orWhereBetween('date_fin', [$reservation->date_debut, $reservation->date_fin])
                ->orWhere(function ($qq) use ($reservation) {
                    $qq->where('date_debut', '<=', $reservation->date_debut)
                        ->where('date_fin', '>=', $reservation->date_fin);
                });
        })
        ->exists();

    if ($dejaPrise) {
        return response()->json([
            'message' => 'Impossible de valider : ce créneau a déjà été attribué.'
        ], 409);
    }

    DB::beginTransaction();
    try {
        $reservation->statut = 'validee';
        $reservation->id_sg = Auth::id();
        $reservation->save();

        // Les autres demandes en attente sur ce créneau deviennent caduques
        foreach ($concurrentes as $autre) {
            $autre->statut = 'annulee';
            $autre->save();
            Notification::create([ /* "Salle occupée sur ce créneau" ... */ ]);
        }
        DB::commit();
    } catch (\\Exception $e) {
        DB::rollBack();
        // ...
    }
}`,
  },
  {
    id: 'realtime',
    lang: 'jsx',
    file: 'RealTimeDisplay.jsx',
    fr: {
      tab: 'Planning en temps réel',
      text: 'L’écran projeté à l’accueil interroge le serveur toutes les 5 secondes (polling), avec un repli sur une autre route si la première échoue. L’horloge tourne à part, pour ne jamais donner l’impression que l’écran est figé, et l’écran ne se met jamais en pause.',
    },
    en: {
      tab: 'Live planning',
      text: 'The screen shown at the reception polls the server every 5 seconds, with a fallback route if the first one fails. The clock runs separately so the screen never looks frozen, and it never pauses.',
    },
    code: `const load = useCallback(async () => {
  try {
    let list;
    try {
      const { data } = await fetchOccupation();
      list = extractList(data);
    } catch {
      const { data } = await fetchRooms(); // repli
      list = extractList(data);
    }
    setRooms(list);
    setUpdatedAt(new Date());
    setOnline(true);
  } catch {
    setOnline(false);
  }
}, []);

// pauseWhenHidden = false : écran kiosque projeté en continu,
// il ne doit jamais geler.
usePolling(load, POLLING_INTERVAL, true, false);

// Horloge découplée du polling de données
useEffect(() => {
  const tick = () => setClock(new Date());
  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);

const counts = useMemo(() => {
  const c = { libre: 0, reservee: 0, occupee: 0 };
  rooms.forEach((r) => {
    const s = r.statut_effectif ?? r.statut;
    c[s] = (c[s] ?? 0) + 1;
  });
  return c;
}, [rooms]);`,
  },
  {
    id: 'chatbot',
    lang: 'php',
    file: 'ChatbotController.php',
    fr: {
      tab: 'Chatbot d’orientation',
      text: 'Un chatbot basé sur des règles : il cherche d’abord dans la FAQ, puis reconnaît des intentions (disponibilité, capacité, tarifs, procédure) et répond avec les vraies données de la base. S’il ne sait pas, il propose de passer la main à un réceptionniste.',
    },
    en: {
      tab: 'Orientation chatbot',
      text: 'A rule-based chatbot: it searches the FAQ first, then recognises intents (availability, capacity, prices, how to book) and answers with real data from the database. If it does not know, it offers to hand over to a receptionist.',
    },
    code: `public function ask(Request $request)
{
    $question = strtolower(trim(
        $request->input('message', $request->input('question', ''))
    ));

    // 1. La FAQ d'abord (questions + mots-clés)
    $faq = Faq::where('question', 'LIKE', "%{$question}%")
        ->orWhere('mots_cles', 'LIKE', "%{$question}%")
        ->first();

    if ($faq) {
        return response()->json(['reponse' => $faq->reponse, 'type' => 'faq']);
    }

    // 2. Intentions reconnues, répondues avec les vraies données
    if (str_contains($question, 'disponible') || str_contains($question, 'libre')) {
        $salles = Salle::where('statut', 'libre')->get();
        // ... "Salles disponibles : A, B, C"
    }

    if (str_contains($question, 'capacité') || str_contains($question, 'combien')) {
        preg_match('/\\d+/', $question, $matches);   // "salle pour 50 personnes"
        $nb = (int) $matches[0];
        $salles = Salle::where('capacite', '>=', $nb)->get();
        // ...
    }

    // ... tarifs, procédure de réservation, localisation

    // 3. Sinon : passer la main à un humain
    return response()->json([
        'reponse' => "Je n'ai pas trouvé de réponse. Souhaitez-vous être redirigé vers un réceptionniste ?",
        'type' => 'redirect',
        'redirect' => true,
    ]);
}`,
  },
]