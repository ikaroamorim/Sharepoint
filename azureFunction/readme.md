
node -v
v18.15.0

Criação de do projeto através da extensão de VS Code
-Timer Trigger
-Typescript


Gerenciando as credenciais do git
git config --list 
git config user.name "Nome do Usuario"
git config user.email "Email do Usuario"


Criando Certificados
mkdir temp
cd temp
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365 -passout pass:HereIsMySuperPass -subj '/C=US/ST=Washington/L=Seattle'
openssl rsa -in keytmp.pem -out key.pem -passin pass:HereIsMySuperPass
cd..

Registrando App Registration
1. https://contoso.sharepoint.com/_layouts/15/appregnew.aspx
2. https://contoso-admin.sharepoint.com/_layouts/15/appinv.aspx
3. <AppPermissionRequests AllowAppOnlyPolicy="true">
      <AppPermissionRequest Scope="http://sharepoint/content/sitecollection" Right="FullControl" />
   </AppPermissionRequests>
https://www.aquaforest.com/blog/using-sharepoint-app-only-authentication-in-aquaforest-products
