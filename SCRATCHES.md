# Strona główna:
TODO

# Lekarz:
Jedna strona dla obu funkcjonalności

- definiowanie dostępności
- dodawanie absencji: logika przeprowadzana przez backend

# Pacjent
## Podstrona z kalendarzem
- podgląd zarezerwowanych terminów
- odwołanie konsultacji

## Podstrona z listą lekarzy
- rezerwacja konsultacji: z listy lekarzy wybiera jednego i zostaje przeniesiony na ekran harmonogramu
- podanie szczegółów potrzebnych do konsultacji w formularzu

## Koszyk
- lista zarezerwowanych konsultacji, możliwość ich usunięcia
- wybór metody płatności
- ekran symulujący płatność

## Klasy do wyświetlania elementów kalendarza
- przeszłe spotkania wyszarzone, i bez możliwości ich usunięcia, ale z możliwością podglądu szczegółów


# Kolory konsultacji:
- szare: przeszłe
- czerwone: odwołane
- zielone: aktualny slot czasowy
- niebieski, fioletowy, żółty, pomarańczowy dla różnych typów konsultacji


// TODO: zamienić kod tak aby operował nie na consultations tylko reservations
//  następnie dodać mozliwość rezerwacji konsultacji przez klienta
//  dodać całą logikę związaną z dodawaniem do koszyka, oraz symulowanie płatności
//  odwołanie rezerwacji -- w kalendarzu po kliknięciu w spotkanie wyskakuje dialog ze szczegółami i tam przycisk do odwołania spotkania
