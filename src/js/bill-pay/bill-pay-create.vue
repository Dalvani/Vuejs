<template>
    <div class="container">
        <div class="row">
            <h5>Nova conta</h5>
            <form name="form" @submit.prevent="submit">
                <div class="row">
                    <div class="input-field col s6">
                        <label class="active">Vencimento:</label>
                        <input type="text" v-model="bill.date_due | dateFormat 'pt-BR'"/>
                    </div>
                    <div class="input-field col s6">
                        <label class="active">Valor:</label>
                        <input type="text" v-model="bill.value | numberFormat 'pt-BR' 'BRL'"/>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s6">
                        <select v-model="bill.name" id="name" class="browser-default">
                            <option value="" disabled selected>Escolha uma opção</option>
                            <option v-for="o in names" :value="o">{{ o | textCaseFormat }}</option>
                        </select>
                        <label class="active">Nome:</label>
                    </div>
                    <div class="input-field col s6">
                        <input type="checkbox" v-model="bill.done" id="pago"/>
                        <label for="pago">Pago?</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input type="submit" value="Enviar" class="btn btn-large right"/>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {BillPay} from '../resources';
    import {BillClass} from '../bill';
    const namesPay = [
        'Conta de luz',
        'Conta de água',
        'Conta de telefone',
        'Supermercado',
        'Cartão de crédito',
        'Empréstimo',
        'Gasolina'
    ];

    export default {
        data(){
            return {
                formType: 'insert',
                names: namesPay,
                bill: new BillClass()
            };
        },
        created() {
            if(this.$route.name == 'bill-pay.update'){
                this.formType = 'update';
                this.getBill(this.$route.params.id);
            }
            /*$(document).ready(function(){
                $('#name').material_select();
            });*/
        },
        ready(){
            $('#name').material_select();
        },
        methods: {
            submit() {
                //let data = Vue.util.extend(this.bill, {date_due: this.getDateDue(this.bill.date_due)});
                let data = this.bill.toJSON();
                if(this.formType == 'insert') {
                    BillPay.save({}, data).then((response) => {
                        Materialize.toast('Conta criada com sucesso!', 3000, 'rounded');
                        this.$dispatch('change-info');
                        this.$router.go({name: 'bill-pay.list'});
                    });
                }else{ //update
                    BillPay.update({id: this.bill.id}, data).then((response) => {
                        Materialize.toast('Conta atualizada com sucesso!', 3000, 'rounded');
                        this.$dispatch('change-info');
                        this.$router.go({name: 'bill-pay.list'});
                    });
                }
            },
            getBill(id) {
                BillPay.get({id: id}).then((response) => {
                    this.bill = new BillClass(response.data);
                });
            },
            getDateDue(date_due){
                let dateDueObject =  date_due;
                if(!(date_due instanceof  Date)){
                    dateDueObject = new Date(dateDueObject.split('/').reverse().join('-') + "T:03:00:00");
                }
                //return dateDueObject.toISOString().split('T')[0];
                return dateDueObject.substring(0,10);
            }
        }
    };
</script>
