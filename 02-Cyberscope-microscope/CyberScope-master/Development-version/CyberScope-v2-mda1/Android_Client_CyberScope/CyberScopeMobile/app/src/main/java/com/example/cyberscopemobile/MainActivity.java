package com.example.cyberscopemobile;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.design.widget.NavigationView;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import org.json.JSONObject;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    //SharedPreferences sharedPreferences = getSharedPreferences("cyber_scope_pref", MODE_PRIVATE);
    //String token = sharedPreferences.getString("authToken", "none");
    OkHttpClient client = new OkHttpClient();
    MediaType JSON_TYPE = MediaType.parse("application/json; charset=utf-8");
    String serverIP = "http://172.27.1.58:4000";

    String nodeRedToken = "Basic YWRtaW46Y2VsZWdhbnM";

    public String execRequest(final String URL, String Method, final String Body){
        //if (token.equals("none"))
            //return ("{ \"error\": \"Cannot find your auth token!\"}");
        final String[] res = new String[1];
        final Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Request request = new Request.Builder()
                        .url(URL)
                        .addHeader("Authorization", nodeRedToken)
                        .post(RequestBody.create(JSON_TYPE, Body))
                        .build();
                Response response = null;
                try {
                    response = client.newCall(request).execute();
                    res[0] = response.body().string();
                } catch (Exception e) {
                    res[0] = e.getMessage();
                }
            }
        });
        thread.start();
        try {
            thread.join();
        } catch (InterruptedException e) {
            Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
        }
        return res[0];
    }

    public void loginFunction(View view) {
        EditText ETemail = findViewById(R.id.emailLogin);
        String email = ETemail.getText().toString();

        EditText ETpassword = findViewById(R.id.passwordLogin);
        String password = ETpassword.getText().toString();

        String res = execRequest(serverIP + "/users/auth", "POST", "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}");

        if (!res.contains("access_token")) {
            String errorMsg = "error";
            try {
                JSONObject json = new JSONObject(res);
                errorMsg = json.getString("error");
            }
            catch (Exception e) {
                errorMsg = res;
            }
            Toast.makeText(getApplicationContext(), errorMsg, Toast.LENGTH_LONG).show();
            return ;
        }
        String token = null;
        try {
            JSONObject json = new JSONObject(res);
            token = json.getString("access_token");
        }
        catch (Exception e) {
            token = "none";
        }
        SharedPreferences sharedPref = getSharedPreferences("cyber_scope_pref", MODE_PRIVATE);
        sharedPref.edit().putString("access_token", token).commit();
        Intent intent = new Intent(MainActivity.this, MainMenu.class);
        startActivity(intent);
    }

    public void registerFunction(View view) {
        EditText ETemail = findViewById(R.id.emailRegister);
        String email = ETemail.getText().toString();

        EditText ETpassword = findViewById(R.id.passwordRegister);
        String password = ETpassword.getText().toString();

        EditText ETname = findViewById(R.id.usernameRegister);
        String name = ETpassword.getText().toString();

        String res = execRequest(serverIP + "/users/register", "POST", "{\"email\": \"" + email + "\", \"password\": \"" + password + "\", \"name\": \"" + name + "\"}");

        if (!res.contains("_id")) {
            String errorMsg = "error";
            try {
                JSONObject json = new JSONObject(res);
                errorMsg = json.getString("error");
            }
            catch (Exception e) {
                errorMsg = res;
            }
            Toast.makeText(getApplicationContext(), errorMsg, Toast.LENGTH_LONG).show();
            return ;
        }
        Toast.makeText(getApplicationContext(), "Your account has been created, you can now login", Toast.LENGTH_LONG).show();
    }

    public void checkAlreadyConnected() {
        SharedPreferences sp = getSharedPreferences("cyber_scope_pref", MODE_PRIVATE);
        String token = sp.getString("access_token", "none");
        MainActivity ma = new MainActivity();
        String res = ma.execRequest(ma.serverIP + "/users/infos", "POST", "{ \"access_token\": \"" + token + "\" }");
        if (res.contains("email")) {
            Intent intent = new Intent(MainActivity.this, MainMenu.class);
            startActivity(intent);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        checkAlreadyConnected();
    }
}
