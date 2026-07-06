# Tasks: Firestore Security Rules

1. [x] `firestore.rules` reescrito con reglas finales por colección
       (users, cines, salas, funciones, boletos, meta).
2. [x] Deploy (`firebase deploy --only firestore:rules`).
3. [x] Probado contra el proyecto real (script descartable, 5/5 checks):
       cliente rechazado creando cine, cliente rechazado creando boleto con
       userId ajeno, cliente sí puede leer cines y comprar su propia
       butaca, admin rechazado auto-desadminizándose, admin sigue pudiendo
       crear cines (regresión OK). Datos de prueba limpiados.
4. [x] Commit + push.
