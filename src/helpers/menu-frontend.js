const getMenuFrontend = (rol = 'USER_ROL') => {
  const menu = [
    {
	title: "Dashboard",
	icon: "mdi mdi-gauge",
	submenu: [
          { title: "Main", url: "/" },
	  { title: "Pogress bar", url: "progress" },
          { title: "Charts", url: "chart1" },
          { title: "Promesas", url: "promesas" },
	  { title: "RxJs", url: "rxjs" }
	]
    },
    {
        title: "Mantenimientos",
	icon: "mdi mdi-folder-lock-open",
	submenu: [
	  // { title: "Usuario", url: "usuarios" },
	   { title: "Hospitales", url: "hospitales" },
	   { title: "Medicos", url: "medicos" }
	 ]
    }
  ];

  if(rol === 'ADMIN_ROL'){
     menu[1].submenu.unshift( { title: "Usuario", url: "usuarios" } )
  }
  return menu;
};

module.exports = {
  getMenuFrontend
}
